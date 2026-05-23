import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.unsplash.com", "res.cloudinary.com"],
  },
  allowedDevOrigins: ["192.168.1.33"],

  /* config options here */
};

export default nextConfig;
