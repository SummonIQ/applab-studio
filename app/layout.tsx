import './globals.css';

import { ThemeProvider } from '@/components/themes/theme-provider';
import { cn } from '@/lib/utils';
import { AnalyticsProvider } from '@summoniq/signalsplash-client-sdk';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';

import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { AppShell } from './components/app-shell';
import { CriticalErrorListener } from './components/critical-error-listener';
import { ScrollRestoration } from './components/scroll-restoration';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const analyticsBase = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
  const normalizedAnalyticsBase = analyticsBase?.replace(/\/$/, '') ?? '';
  const analyticsEndpoint = normalizedAnalyticsBase
    ? /\/api\/(events|analytics)$/.test(normalizedAnalyticsBase)
      ? normalizedAnalyticsBase
      : `${normalizedAnalyticsBase}/api/events`
    : '';
  const analyticsConfig = {
    appId: 'designer',
    endpoint: analyticsEndpoint,
    enabled: Boolean(analyticsEndpoint),
  };

  return (
    <html className={cn(GeistSans.className, GeistMono.className)} lang="en">
      <head>
        <title>SummonIQ Designer</title>
        <meta
          content="Design studio for SummonIQ projects"
          name="description"
        />
      </head>

      <body className="antialiased font-sans pointer-events-auto!">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Suspense fallback={null}>
            <ScrollRestoration />
          </Suspense>
          <CriticalErrorListener />
          <AnalyticsProvider config={analyticsConfig}>
            <Suspense
              fallback={
                <div className="flex h-screen items-center justify-center">
                  <div className="animate-pulse text-muted-foreground">
                    Loading...
                  </div>
                </div>
              }
            >
              <AppShell>{children}</AppShell>
            </Suspense>
          </AnalyticsProvider>
          <Toaster
            position="top-right"
            duration={5000}
            toastOptions={{
              style: {
                background: 'hsl(var(--card))',
                color: 'hsl(var(--card-foreground))',
                border: '1px solid hsl(var(--border))',
                boxShadow:
                  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
                backdropFilter: 'blur(8px)',
              },
              className: 'font-sans',
            }}
            richColors
            theme="system"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
