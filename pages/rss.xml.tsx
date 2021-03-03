import { GetServerSideProps } from 'next'

import { getAllPosts, getAllSettings, GhostPostsOrPages } from '@lib/ghost'
import { generateRSSFeed } from '@utils/rss'

const RSS = () => null

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  let settings
  let posts: GhostPostsOrPages | []

  try {
    settings = await getAllSettings()
    posts = await getAllPosts()
  } catch (error) {
    throw new Error('Index creation failed.')
  }

  let rssData = null
  if (settings.processEnv.rssFeed) {
    rssData = generateRSSFeed({ posts, settings })
  }

  if (res && rssData) {
    res.setHeader('Content-Type', 'text/xml')
    res.write(rssData)
    res.end()
  }

  return {
    props: {},
  }
}

export default RSS
