/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@repo/shared-types'],
  distDir: process.env.NEXT_DIST_DIR || '.next',
  // Disable aggressive client router cache so code edits and data updates render immediately without stale pages
  experimental: {
    staleTimes: {
      dynamic: 0,
      static: 0,
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
