/** @type {import('next').NextConfig} */
const nextConfig = {
  // luma-web ships untranspiled ESM — let Next compile it so no
  // environment chokes on the raw module syntax during build.
  transpilePackages: ["@lumaai/luma-web"],
  eslint: {
    ignoreDuringBuilds: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "connect-src 'self' https://*.luma.com https://*.lumalabs.ai https://*.cdn-luma.com https://*.engineeringlumalabs.com https://*.r2.dev; img-src 'self' blob: data: https://*.luma.com https://*.lumalabs.ai https://*.cdn-luma.com https://*.engineeringlumalabs.com https://*.r2.dev; worker-src 'self' blob:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
