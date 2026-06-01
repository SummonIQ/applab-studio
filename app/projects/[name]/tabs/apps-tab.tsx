'use client';

import { RunControlButton } from '@/components/runtime/run-control-button';
import { getAppDevPort } from '@/lib/ports';
import { Report, type ReportColumnDefinition } from '@summoniq/applab-ui';
import {
  Box,
  FileText,
  Globe,
  Monitor,
  Package,
  Server,
  Smartphone,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

type RuntimeProject = {
  name: string;
  description: string;
  path?: string;
  hasConfig?: boolean;
  apps?: any[];
};

interface AppsTabProps {
  project: RuntimeProject;
}

const typeIcons: Record<string, any> = {
  'web-app': Globe,
  'desktop-app': Monitor,
  'mobile-app': Smartphone,
  api: Server,
  'marketing-site': FileText,
  library: Package,
  monorepo: Box,
};

export function AppsTab({ project }: AppsTabProps) {
  const router = useRouter();
  const apps = useMemo(() => project.apps || [], [project.apps]);
  const [launchingByName, setLaunchingByName] = useState<
    Record<string, boolean>
  >({});
  const [runningByName, setRunningByName] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    if (!window.electron?.applications?.checkPort) return;
    if (!Array.isArray(apps) || apps.length === 0) return;

    let canceled = false;

    async function syncFromPorts() {
      const updates: Array<{ name: string; listening: boolean }> = [];
      await Promise.all(
        apps.map(async (app: any) => {
          const port = getAppDevPort(app);
          if (typeof port !== 'number') return;
          try {
            const portStatus =
              await window.electron.applications.checkPort(port);
            updates.push({
              name: String(app.name),
              listening: Boolean(portStatus?.listening),
            });
          } catch {
            // ignore
          }
        }),
      );

      if (canceled) return;
      if (updates.length === 0) return;
      setRunningByName(prev => {
        const next = { ...prev };
        for (const u of updates) next[u.name] = u.listening;
        return next;
      });
    }

    syncFromPorts();
    const interval = setInterval(syncFromPorts, 5000);
    return () => {
      canceled = true;
      clearInterval(interval);
    };
  }, [apps]);

  const appColumns: ReportColumnDefinition<any>[] = [
    {
      key: 'launch',
      header: '',
      width: '140px',
      cellFn: app => {
        const name = String(app?.name || '');
        const isRunning = Boolean(runningByName[name]);
        const isLaunching = Boolean(launchingByName[name]);
        const isStopping = isLaunching && isRunning;
        const state = isStopping
          ? 'stopping'
          : isLaunching
            ? 'starting'
            : isRunning
              ? 'running'
              : 'stopped';

        return (
          <div className="flex items-center" onClick={e => e.stopPropagation()}>
            <RunControlButton
              onClick={e => {
                e.stopPropagation();
                if (!name) return;

                if (isRunning) {
                  void handleStopApp(app);
                  return;
                }
                void handleLaunchApp(app);
              }}
              state={state}
              size="sm"
              loading={isLaunching}
              aria-label={isRunning ? 'Stop app' : 'Start app'}
              startingLabel="Starting..."
              stoppingLabel="Stopping..."
            />
          </div>
        );
      },
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      cellFn: app => <span className="font-medium truncate">{app.name}</span>,
    },
    {
      key: 'type',
      header: 'Type',
      sortable: true,
      cellFn: app => {
        const AppIcon = typeIcons[app.type] || Box;
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-secondary text-xs font-medium capitalize">
            <AppIcon className="size-3.5" />
            {app.type?.replace('-', ' ') || 'Unknown'}
          </span>
        );
      },
    },
    {
      key: 'devPort',
      header: 'Port',
      align: 'center',
      sortable: true,
      cellFn: app =>
        getAppDevPort(app) ? (
          <span className="inline-flex items-center px-2 py-1 rounded-md bg-muted text-xs font-mono">
            {getAppDevPort(app)}
          </span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      key: 'description',
      header: 'Description',
      cellFn: app => (
        <span className="text-muted-foreground">{app.description || '—'}</span>
      ),
    },
  ];

  const handleRowClick = (app: any) => {
    const encodedProjectName = encodeURIComponent(String(project?.name || ''));
    const encodedAppName = encodeURIComponent(String(app?.name || ''));
    router.push(`/projects/${encodedProjectName}/apps/${encodedAppName}`);
  };

  const handleLaunchApp = async (app: {
    name: string;
    type?: string;
    description?: string;
    path?: string;
    devPort?: number;
  }) => {
    if (project?.path && window.electron) {
      const appNameValue = String(app.name);
      setLaunchingByName(prev => ({ ...prev, [appNameValue]: true }));

      toast.loading(`Starting ${app.name}...`, { id: `launch-${app.name}` });

      const appPathForLaunch = app.path && app.path !== '.' ? app.path : null;
      const result = await window.electron.applications.launch(
        project.path,
        app.name,
        'dev',
        appPathForLaunch,
        getAppDevPort(app),
      );

      if (result.success) {
        toast.success(result.message || `${app.name} started successfully`, {
          id: `launch-${app.name}`,
          description: result.pid ? `Process ID: ${result.pid}` : undefined,
        });
        setRunningByName(prev => ({ ...prev, [appNameValue]: true }));
      } else {
        toast.error(result.error || `Failed to launch ${app.name}`, {
          id: `launch-${app.name}`,
        });
      }

      setLaunchingByName(prev => ({ ...prev, [appNameValue]: false }));
    }
  };

  const handleStopApp = async (app: {
    name: string;
    path?: string;
    devPort?: number;
  }) => {
    if (!project?.path || !window.electron?.applications?.stop) return;
    const appNameValue = String(app.name);

    setLaunchingByName(prev => ({ ...prev, [appNameValue]: true }));
    try {
      const result = await window.electron.applications.stop(
        project.path,
        app.name,
        app.path || null,
        getAppDevPort(app),
      );

      if (result?.success) {
        toast.success(`${app.name} stopped`, { id: `stop-${app.name}` });
        setRunningByName(prev => ({ ...prev, [appNameValue]: false }));
      } else {
        toast.error(result?.error || `Failed to stop ${app.name}`, {
          id: `stop-${app.name}`,
        });
      }
    } finally {
      setLaunchingByName(prev => ({ ...prev, [appNameValue]: false }));
    }
  };

  return (
    <div className="flex h-full flex-col gap-6">
      <div>
        <h2 className="text-lg font-semibold">Applications</h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          {project.apps?.length || 0} application
          {project.apps?.length !== 1 ? 's' : ''} configured
        </p>
      </div>

      <Report
        data={apps}
        definition={{
          columns: appColumns,
          activeFilters: [],
          filters: [],
          sortBy: 'name',
          view: 'table' as any,
          data: apps,
        }}
        onRowClick={handleRowClick}
        emptyState={{
          title: 'No applications configured yet',
          description:
            'Create apps in AppLab or add entries to your project config.',
          illustration: <Box className="w-12 h-12 mx-auto mb-3 opacity-50" />,
        }}
        className="h-auto"
        contentClassName="bg-muted/20"
      />
    </div>
  );
}
