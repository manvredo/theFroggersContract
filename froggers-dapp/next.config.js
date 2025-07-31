/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['cdn.thefroggers.xyz', 'ipfs.io'],
  },
  experimental: {
    serverActions: false,
  },
  webpack(config) {
    config.resolve.alias['~'] = __dirname;
    return config;
  },
};

module.exports = nextConfig;
