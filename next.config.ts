import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Next.js will automatically detect the app directory in src/
  // No additional configuration needed for src/ directory support
  
  // Add any other configuration options here
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
