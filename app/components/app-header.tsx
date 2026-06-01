'use client';

import { Box, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AiChatPopover } from '@summoniq/applab-ui';

export function AppHeader() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isMacOS, setIsMacOS] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
    setIsMacOS(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 flex h-11 items-center justify-between px-3 border-b border-border/50 bg-background/80 backdrop-blur-xl ${isMacOS ? 'pl-20' : ''}`}
      style={{ WebkitAppRegion: 'drag' } as React.CSSProperties}
    >
      {/* Left: App Icon & Name */}
      <div className="flex items-center gap-2.5 w-[230px]">
        <div className="h-6 w-6 rounded-md bg-gradient-to-br from-purple-600 via-purple-700 to-blue-700 border-t border-t-pink-400/75 flex items-center justify-center">
          <Box className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <h1 className="font-semibold text-[13px] text-foreground">
            SummonIQ Designer
          </h1>
          <p className="text-[10px] text-muted-foreground">v0.1.0</p>
        </div>
      </div>

      {/* Navigation & Search */}
      <div className="flex-1 flex items-center gap-3">
        {/* Navigation Buttons */}
        <div
          className="flex items-center gap-1"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <button
            aria-label="Go back"
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            onClick={() => router.back()}
          >
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            aria-label="Go forward"
            className="p-1.5 rounded-md hover:bg-muted transition-colors"
            onClick={() => router.forward()}
          >
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Search */}
        <div
          className="flex-1 max-w-lg relative"
          style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            className="w-full bg-card border border-border rounded-md pl-9 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-all"
            placeholder="Search projects and pages..."
            type="search"
          />
        </div>
      </div>

      {/* Right: AI Assistant */}
      <div
        className="flex items-center gap-2"
        style={{ WebkitAppRegion: 'no-drag' } as React.CSSProperties}
      >
        {mounted && <AiChatPopover />}
      </div>
    </div>
  );
}
