import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@mailcare/shared-types', '@mailcare/database', '@mailcare/api-gateway'],
};

export default nextConfig;
