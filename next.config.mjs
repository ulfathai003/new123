/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip ESLint during builds — it's an infra-fragility we can't afford
  // on Vercel. We lint locally instead.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
