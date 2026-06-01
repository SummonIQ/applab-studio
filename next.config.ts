import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  transpilePackages: [
    '@summoniq/signalsplash-client-sdk',
    '@summoniq/config',
    '@summoniq/mcp-server',
    '@summoniq/applab-ui',
  ],
  webpack: config => {
    if (config.resolve) config.resolve.symlinks = false;
    return config;
  },
  experimental: {
    authInterrupts: true,
    turbopackFileSystemCacheForDev: true,
    externalDir: true,
    cacheComponents: true,
  },
  reactCompiler: true,
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
