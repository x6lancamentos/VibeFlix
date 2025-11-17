/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: ['img.youtube.com', 'drive.google.com'],
  },
}

module.exports = nextConfig

