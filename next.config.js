const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  ...(process.env.NETLIFY === 'true' && { target: 'serverless' }),
  images: {
    deviceSizes: [320, 500, 680, 1040, 2080, 2048, 3120],
    domains: [
      'localhost',
      'images.unsplash.com',
      'static.gotsby.org',
      'static.ghost.org',
      'hooshmand.net',
      'cms.jamify.org',
      'www.jamify.org',
      'www.gatsbyjs.org',
      'cdn.commento.io',
      'gatsby.ghost.io',
      'ghost.org',
    ],
  },
  reactStrictMode: false,
})
