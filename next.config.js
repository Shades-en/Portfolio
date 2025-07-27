/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Fix for ChunkLoadError during development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Increase chunk loading timeout for development
      config.output.chunkLoadTimeout = 120000; // 2 minutes
      
      // Optimize chunk splitting for development
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true,
            },
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: -10,
              chunks: 'all',
            },
          },
        },
      };
    }
    return config;
  },
  // Development server configuration
  ...(process.env.NODE_ENV === 'development' && {
    devIndicators: {
      position: 'bottom-right',
    },
    // Reduce memory usage during development
    onDemandEntries: {
      maxInactiveAge: 60 * 1000, // 1 minute
      pagesBufferLength: 2,
    },
  }),
};

module.exports = nextConfig;
