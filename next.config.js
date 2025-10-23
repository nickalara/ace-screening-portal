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
}

module.exports = nextConfig
