/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@repo/shared-types'],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
