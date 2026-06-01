'use client';

import { Button } from '@summoniq/applab-ui';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import type { ReactNode } from 'react';

const decodeParam = (value?: string) => {
  if (!value) return '';
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

export default function ProjectLayout({ children }: { children: ReactNode }) {
  const params = useParams<{ name: string }>();
  const projectName = decodeParam(params?.name);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-border bg-background px-6 py-4">
        <Button asChild variant="ghost" size="sm">
          <Link href="/projects" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Link>
        </Button>
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Project
          </p>
          <h1 className="text-lg font-semibold truncate">
            {projectName || 'Untitled'}
          </h1>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
}
