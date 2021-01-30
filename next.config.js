const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  ...(process.env.NETLIFY === 'true' && { target: 'serverless' }),
  images: {
    deviceSizes: [320, 500, 680, 1040, 2080, 2048, 3120],
    loader: 'akamai',
    domains: [
      'localhost',
      'images.unsplash.com',
      'static.gotsby.org',
      'static.ghost.org',
      'hooshmand.net',
      'www.gatsbyjs.org',
      'cdn.commento.io',
      'gatsby.ghost.io',
      'ghost.org',
      'repository-images.githubusercontent.com',
      'www.gravatar.com',
      'github.githubassets.com',
      'miguelbernard.com',
      'blog.miguelbernard.com',
      'www.miguelbernard.com',
      'cms.miguelbernard.com',
      'cms-dev.miguelbernard.com',
    ],
  },
  reactStrictMode: true,
  redirects: () => [
    {
      source: '/rss',
      destination: '/rss.xml',
      permanent: true,
    },
  ]
})