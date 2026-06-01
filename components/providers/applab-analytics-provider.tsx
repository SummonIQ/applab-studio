'use client';

import type { AnalyticsConfig } from '@summoniq/signalsplash-client-sdk';
import { AnalyticsProvider, WebVitals } from '@summoniq/signalsplash-client-sdk';
import { useMemo } from 'react';

interface Props {
  children: React.ReactNode;
}

export function AppAnalyticsProvider({ children }: Props) {
  const analyticsEnabled = process.env.NEXT_PUBLIC_ENABLE_ANALYTICS !== 'false';
  const appId = process.env.NEXT_PUBLIC_ANALYTICS_APP_ID || 'gimme-job-dev';
  const endpoint =
    process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT || 'http://localhost:20000/api/events';

  const config = useMemo<AnalyticsConfig>(
    () => ({
      appId,
      enabled: analyticsEnabled,
      endpoint,
      trackPageViews: true,
      trackWebVitals: true,
      provider: {
        provider: 'applab',
        endpoint,
      },
    }),
    [analyticsEnabled, appId, endpoint],
  );

  if (!analyticsEnabled) {
    return <>{children}</>;
  }

  return (
    <AnalyticsProvider config={config}>
      {children}
      <WebVitals />
    </AnalyticsProvider>
  );
}
