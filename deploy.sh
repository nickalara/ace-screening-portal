#!/bin/bash

# Azure Oryx will automatically detect this is a Node.js app
# and run npm install and npm run build

# Exit on error
set -e

echo "Starting deployment..."

# Install dependencies
echo "Installing dependencies..."
npm ci --production=false

# Build the Next.js application
echo "Building Next.js application..."
npm run build

echo "Deployment preparation complete!"
