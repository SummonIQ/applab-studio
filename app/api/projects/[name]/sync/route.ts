import { prisma } from '@/lib/db/prisma';
import { getNextAvailablePortForProject } from '@/lib/port-manager';
import { analyzeProject } from '@/lib/project-analyzer';
import { AppType } from '@prisma/client';
import { promises as fs } from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import path from 'path';

const PROJECTS_BASE =
  process.env.PROJECTS_BASE || path.join(os.homedir(), 'Projects');

function toAppType(value: unknown): AppType {
  if (typeof value !== 'string') return 'WEB_APP';

  const typeMap: Record<string, AppType> = {
    'web-app': 'WEB_APP',
    'desktop-app': 'DESKTOP_APP',
    'mobile-app': 'MOBILE_APP',
    api: 'API',
    'marketing-site': 'MARKETING_SITE',
    library: 'LIBRARY',
    monorepo: 'MONOREPO',
    cli: 'CLI',
    extension: 'EXTENSION',
    docs: 'CUSTOM',
    custom: 'CUSTOM',
    unknown: 'CUSTOM',
  };

  const normalized = value.trim();
  const mapped = typeMap[normalized] ?? typeMap[normalized.toLowerCase()];
  if (mapped) return mapped;

  const upper = normalized.toUpperCase();
  return (Object.values(AppType) as string[]).includes(upper)
    ? (upper as AppType)
    : 'WEB_APP';
}

// POST - Sync/re-analyze project and update config + database
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  try {
    const { name: projectName } = await params;

    console.log('[API] Syncing project:', projectName);

    // Get project from database
    const project = await prisma.project.findUnique({
      where: { name: projectName },
      include: { apps: true },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found in database' },
        { status: 404 },
      );
    }

    const projectPath = project.path || path.join(PROJECTS_BASE, projectName);

    // Analyze project to detect apps
    let analysis;
    try {
      analysis = await analyzeProject(projectPath);
      console.log(
        '[API] Analysis complete. Detected',
        analysis.apps?.length || 0,
        'apps',
      );
    } catch (analyzeError) {
      console.error('[API] Failed to analyze project:', analyzeError);
      return NextResponse.json(
        {
          error: 'Failed to analyze project',
          details:
            analyzeError instanceof Error
              ? analyzeError.message
              : String(analyzeError),
        },
        { status: 500 },
      );
    }

    const detectedApps = analysis.apps || [];

    // Read existing config to preserve apps that aren't on disk yet
    const configPath = path.join(projectPath, 'applab.config.ts');
    let existingConfigApps: typeof detectedApps = [];
    try {
      const configContent = await fs.readFile(configPath, 'utf-8');
      const appsMatch = configContent.match(/apps:\s*\[([\s\S]*?)\]\s*[,}]/);
      if (appsMatch) {
        // Extract app objects from config
        const appsSection = appsMatch[1];
        const appMatches = appsSection.matchAll(
          /\{[^{}]*name:\s*['"]([^'"]+)['"][^{}]*\}/g,
        );
        for (const match of appMatches) {
          const appBlock = match[0];
          const name = match[1];
          const typeMatch = appBlock.match(/type:\s*['"]([^'"]+)['"]/);
          const descMatch = appBlock.match(/description:\s*['"]([^'"]+)['"]/);
          const pathMatch = appBlock.match(/path:\s*['"]([^'"]+)['"]/);
          const portMatch = appBlock.match(/port:\s*(\d+)/);
          const cmdMatch = appBlock.match(/command:\s*['"]([^'"]+)['"]/);

          existingConfigApps.push({
            name,
            type: typeMatch?.[1] || 'web-app',
            description: descMatch?.[1] || '',
            path: pathMatch?.[1] || `apps/${name}`,
            devPort: portMatch ? parseInt(portMatch[1]) : undefined,
            devCommand: cmdMatch?.[1] || 'bun dev',
          });
        }
      }
      console.log(
        '[API] Existing config apps:',
        existingConfigApps.map(a => a.name),
      );
    } catch {
      console.log('[API] No existing config file or failed to parse');
    }

    // Merge: detected apps take priority, but keep config apps that weren't detected
    const detectedNames = new Set(detectedApps.map(a => a.name));
    const configOnlyApps = existingConfigApps.filter(
      a => !detectedNames.has(a.name),
    );
    const mergedApps = [...detectedApps, ...configOnlyApps];

    console.log(
      '[API] Merged apps:',
      mergedApps.map(a => a.name),
    );

    const existingAppNames = project.apps.map(a => a.name);
    const newApps: typeof detectedApps = [];
    const updatedApps: typeof detectedApps = [];

    // Categorize apps
    for (const app of mergedApps) {
      if (existingAppNames.includes(app.name)) {
        updatedApps.push(app);
      } else {
        newApps.push(app);
      }
    }

    console.log(
      '[API] New apps:',
      newApps.map(a => a.name),
    );
    console.log(
      '[API] Existing apps to update:',
      updatedApps.map(a => a.name),
    );

    // Update or create apps in database
    for (const app of mergedApps) {
      const appTypeEnum = toAppType(app.type);

      // Determine dev port - use detected, existing, or auto-assign
      let devPort = app.devPort;
      const existingApp = project.apps.find(a => a.name === app.name);

      if (!devPort && existingApp?.devPort) {
        devPort = existingApp.devPort;
      }

      if (!devPort) {
        try {
          const autoPort = await getNextAvailablePortForProject(
            project.id,
            appTypeEnum,
          );
          if (autoPort) {
            devPort = autoPort;
            console.log('[API] Auto-assigned port:', devPort, 'for:', app.name);
          }
        } catch (error) {
          console.warn('[API] Could not auto-assign port for:', app.name);
        }
      }

      // Upsert app in database
      await prisma.app.upsert({
        where: {
          projectId_name: {
            projectId: project.id,
            name: app.name,
          },
        },
        update: {
          type: appTypeEnum,
          path: app.path,
          devPort: devPort,
          description: app.description || undefined,
        },
        create: {
          projectId: project.id,
          name: app.name,
          type: appTypeEnum,
          path: app.path,
          devPort: devPort,
          description: app.description || '',
          autoOpen: false,
        },
      });

      // Update devPort in detectedApps for config generation
      app.devPort = devPort;
    }

    console.log('[API] Database updated');

    // Generate updated applab.config.ts
    const appsConfigArray =
      mergedApps.length > 0
        ? mergedApps
            .map(
              app => `    {
      name: '${app.name}',
      type: '${app.type || 'web-app'}',
      description: '${app.description || ''}',
      path: '${app.path}',${
        app.devPort || app.devCommand
          ? `
      dev: {${
        app.devCommand
          ? `
        command: '${app.devCommand}',`
          : ''
      }${
        app.devPort
          ? `
        port: ${app.devPort},`
          : ''
      }
      },`
          : ''
      }
    }`,
            )
            .join(',\n')
        : '';

    const configContent = `export default {
  name: '${projectName}',
  description: '${project.description || 'SummonIQ managed project'}',
  type: '${analysis.type || 'monorepo'}',
  apps: [
${appsConfigArray}
  ],
};
`;

    // Write updated config file (configPath already defined above)
    await fs.writeFile(configPath, configContent, 'utf-8');
    console.log('[API] Config file updated at:', configPath);

    // Update project in database with analysis info
    await prisma.project.update({
      where: { id: project.id },
      data: {
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Project synced: ${newApps.length} new app(s), ${updatedApps.length} updated`,
      appsDetected: detectedApps.length,
      newApps: newApps.map(a => a.name),
      updatedApps: updatedApps.map(a => a.name),
      apps: detectedApps,
    });
  } catch (error) {
    console.error('[API] Error syncing project:', error);
    return NextResponse.json(
      {
        error: 'Failed to sync project',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
