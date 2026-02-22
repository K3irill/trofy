import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3333',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'trofy.art',
        pathname: '/uploads/**',
      },
    ],
    // Разрешаем неоптимизированные изображения для localhost в development
    unoptimized: process.env.NODE_ENV === 'development',
  },
  async rewrites() {
    // В продакшене Nginx проксирует /api и /uploads, поэтому rewrites не нужны
    if (process.env.NODE_ENV === 'production') {
      return []
    }
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3333/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://localhost:3333/uploads/:path*',
      },
    ]
  },
}

export default nextConfig
