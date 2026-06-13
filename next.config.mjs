import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: __dirname,
  },
  // This is a JS project (no TypeScript); skip ESLint during the build so a
  // lint-infra hiccup can never fail the Vercel deploy. Lint locally instead.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
