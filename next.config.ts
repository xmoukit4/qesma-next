import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: {
    buildActivity: false,
  },
  experimental: {
    allowedDevOrigins: [
      "https://3000-firebase-qesma-1758208711318.cluster-ikslh4rdsnbqsvu5nw3v4dqjj2.cloudworkstations.dev",
    ],
  },
};

export default nextConfig;
