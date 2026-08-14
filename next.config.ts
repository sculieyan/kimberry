import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/Home.html',
        destination: '/',
        permanent: true,
      },
    ]
  },
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.s3.ap-southeast-2.amazonaws.com',
        pathname: '/profile-image/**',
        port: '',
        search: '',
      },
    ],
  }, 
  experimental: {
    optimizeCss: true,
  },
  webpack: (config, { }) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      minSize: 20000,
      maxSize: 70000,
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.(css|scss)$/,
          chunks: 'all',
          enforce: true
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        }
      }
    }
    return config
  },
};

export default nextConfig;