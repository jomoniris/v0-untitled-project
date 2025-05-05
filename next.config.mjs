/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable static generation to avoid ref issues during build
    disableStaticGeneration: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
