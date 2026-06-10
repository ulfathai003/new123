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
};

export default nextConfig;
