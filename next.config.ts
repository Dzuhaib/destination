import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "destinationwholesale.co.uk" },
      { protocol: "https", hostname: "www.destinationwholesale.co.uk" },
    ],
  },
};

export default nextConfig;
