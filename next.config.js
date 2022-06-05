const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
})

const withMDX = require('@next/mdx')({
  extension: /\.mdx?$/
})

const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  ...(process.env.STANDALONE && {
    experimental: {
      outputStandalone: 'true'
    }
  }),
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/solver',
        permanent: true
      }
    ]
  }
}

module.exports = withBundleAnalyzer(withMDX(nextConfig))
