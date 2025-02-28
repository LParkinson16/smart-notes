/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any) => {
    config.resolve.fallback = {
      fs: false,
      module: false,
    };
    return config;
  },
};

module.exports = nextConfig;
