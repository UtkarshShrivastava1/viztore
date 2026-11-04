/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/shared-types'],
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Performance hardening: Enable client router cache so prefetching and page transitions are instant (0ms)
  experimental: {
    staleTimes: {
      dynamic: 30, // Keep dynamic pages in client router cache for 30s
      static: 180, // Keep static/prefetched pages in client router cache for 3m
    },
  },
  webpack: (config, { dev }) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
      '.cjs': ['.cts', '.cjs'],
    };

    if (dev) {
      config.watchOptions = {
        poll: 300,
        aggregateTimeout: 100,
      };
    }

    return config;
  },
  async redirects() {
    return [
      { source: '/about', destination: '/account/support', permanent: false },
      { source: '/contact', destination: '/account/support', permanent: false },
      { source: '/partner', destination: '/account/sell', permanent: false },
      { source: '/terms', destination: '/account/terms', permanent: false },
      { source: '/seller-terms', destination: '/account/terms', permanent: false },
      { source: '/careers', destination: '/account/support', permanent: false },
      { source: '/privacy', destination: '/account/privacy', permanent: false },
      { source: '/refund', destination: '/account/terms', permanent: false },
      { source: '/grievance', destination: '/account/support', permanent: false },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/store/:slug*',
        destination: '/stores/:slug*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

module.exports = nextConfig;
