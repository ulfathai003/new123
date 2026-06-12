import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root: a drive-wide lockfile exists above this project,
  // and without this Next/Turbopack can infer the wrong root for builds.
  turbopack: {
    root: __dirname,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://*.luma.com https://*.lumalabs.ai; connect-src 'self' https://*.luma.com https://*.lumalabs.ai https://*.cdn-luma.com; worker-src 'self' blob:; child-src 'self' blob:; frame-src 'self';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
