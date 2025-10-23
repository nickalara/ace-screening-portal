const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configure webpack to resolve @ alias for Azure Oryx builds
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    }
    return config
  },
  // Allow external images from StartGuides domain
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'startguides.net',
        pathname: '/wp-content/uploads/**',
      },
    ],
  },
}

module.exports = nextConfig
