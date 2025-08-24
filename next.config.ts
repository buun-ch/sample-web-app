import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker production builds
  output: 'standalone',

  logging: process.env.DISABLE_HEALTH_REQUEST_LOGS === '1' ? {
    incomingRequests: {
      ignore: [/healthz/],
    },
  } : undefined,
};

export default nextConfig;
