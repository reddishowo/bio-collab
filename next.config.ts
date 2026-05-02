import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["172.16.0.2"],
  reactCompiler: true,
};

export default nextConfig;
