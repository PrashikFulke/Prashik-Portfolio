/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      {
        source: '/BAXTON',
        destination: '/?project=baxton',
        permanent: true,
      },
      {
        source: '/baxton',
        destination: '/?project=baxton',
        permanent: true,
      }
    ];
  }
};

export default nextConfig;
