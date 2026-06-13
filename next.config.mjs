/** @type {import('next').NextConfig} */
const nextConfig = {
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
            value: "connect-src 'self' https://*.luma.com https://*.lumalabs.ai https://*.cdn-luma.com https://*.engineeringlumalabs.com; img-src 'self' blob: data: https://*.luma.com https://*.lumalabs.ai https://*.cdn-luma.com https://*.engineeringlumalabs.com; worker-src 'self' blob:;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
