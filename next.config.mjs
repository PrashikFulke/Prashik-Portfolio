/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // Security: hide X-Powered-By header
  compress: true, // Enable gzip compression
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
  experimental: {
    optimizeCss: true, // Optimizes CSS imports
  }
};

export default nextConfig;
