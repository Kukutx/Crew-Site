import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // 地图页用的地图源，后续可替代
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
