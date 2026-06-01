'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import { NavigationMenu } from '@/components/navigation/navigation-menu';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/studio/ui/resizable';
import { AppHeader } from './app-header';

const COLLAPSED_SIZE = 4; // percentage when collapsed (icon only)
const COLLAPSE_THRESHOLD = 8; // percentage below which to snap to collapsed

const mainNavigation = [
  { href: '/', icon: 'Home', name: 'Dashboard' },
  { href: '/projects', icon: 'Grid3x3', name: 'Projects' },
  { href: '/studio', icon: 'Palette', name: 'Studio' },
  {
    href: '/design',
    icon: 'Palette',
    name: 'Design',
    children: [
      { href: '/asset-designer', icon: 'Palette', name: 'Asset Designer' },
      { href: '/layouts', icon: 'Layers', name: 'Layouts' },
      { href: '/themes', icon: 'Brush', name: 'Themes' },
    ],
  },
];

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isStudioRoute = pathname?.startsWith('/studio');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleResize = (sizes: number[]) => {
    const sidebarSize = sizes[0];
    if (sidebarSize <= COLLAPSE_THRESHOLD && !isCollapsed) {
      setIsCollapsed(true);
    } else if (sidebarSize > COLLAPSE_THRESHOLD && isCollapsed) {
      setIsCollapsed(false);
    }
  };

  if (isStudioRoute) {
    return <div className="h-screen">{children}</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      <AppHeader />
      <div className="flex-1 overflow-hidden pt-11 bg-muted/20">
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full"
          onLayout={handleResize}
          autoSaveId="app-shell-sidebar"
        >
          <ResizablePanel
            defaultSize={15}
            minSize={COLLAPSED_SIZE}
            maxSize={25}
            collapsedSize={COLLAPSED_SIZE}
            collapsible
            onCollapse={() => setIsCollapsed(true)}
            onExpand={() => setIsCollapsed(false)}
          >
            <div className="flex flex-col h-full select-none border-r border-border/50 bg-muted/30 overflow-y-auto">
              <NavigationMenu items={mainNavigation} collapsed={isCollapsed} />

            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={85}>
            <div
              id="main-scroll-container"
              className="flex flex-col flex-1 h-full overflow-auto bg-muted/20"
            >
              {children}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  );
}
