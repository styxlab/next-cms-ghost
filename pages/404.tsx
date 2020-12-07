
import Link from 'next/link'
import { GetStaticProps } from 'next'

import { Layout } from '@components/Layout'
import { HeaderPage } from '@components/HeaderPage'
import { PostCard } from '@components/PostCard'

import { getAllPosts, getAllSettings, GhostSettings, GhostPostsOrPages } from '@lib/ghost'
import { useLang, get } from '@utils/use-lang'
import { BodyClass } from '@helpers/BodyClass'

export const getStaticProps: GetStaticProps = async () => {
  const posts = await getAllPosts({ limit: 3 })
  const settings = await getAllSettings()

  return {
    props: {
      settings,
      posts,
      bodyClass: BodyClass({})
    },
  }
}

interface Custom404Props {
  posts: GhostPostsOrPages
  settings: GhostSettings
  bodyClass: string
}

export default function Custom404({ posts, settings, bodyClass }: Custom404Props) {
  const text = get(useLang())

  return (
    <Layout {...{ settings, bodyClass }} header={<HeaderPage {...{ settings }} />} errorClass="error-content">
      <div className="inner">
        <section className="error-message">
          <h1 className="error-code">404</h1>
          <p className="error-description">{text(`PAGE_NOT_FOUND`)}</p>
          <Link href="/" ><a className="error-link">{text(`GOTO_FRONT_PAGE`)} →</a></Link>
        </section>

        <div className="post-feed">
          {posts.map((post, i) => (
            <PostCard key={post.id} {...{ settings, post, num: i }} />
          ))}
        </div>

      </div>
    </Layout>
  )
}
