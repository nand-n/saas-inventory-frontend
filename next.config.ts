/** @type {import('next').NextConfig} */
const nextConfig = {
  // output: 'export',
  
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: { unoptimized: true },
  // experimental: {
  //   esmExternals: false,
  // },
};

module.exports = nextConfig;
