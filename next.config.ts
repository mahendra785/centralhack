import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '300mb',
    },
  },
  images: {
    remotePatterns: [
        {
            protocol: 'https',
            hostname: 'storage.googleapis.com',
            port: '',
            pathname: `/${process.env.GOOGLE_CLOUD_PUBLIC_BUCKET}/**`,
        },
        {
          protocol: 'https',
          hostname: 'avatar.vercel.sh',
      },
    ],
  },
};

export default nextConfig;
