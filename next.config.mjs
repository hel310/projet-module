/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/ask',
        destination: 'http://localhost:5001/api/ask',
      },
    ]
  },
}

export default nextConfig


