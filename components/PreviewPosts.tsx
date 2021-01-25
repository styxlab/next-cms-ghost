import Link from 'next/link'
import dayjs from 'dayjs'

import { PostCard } from '@components/PostCard'

import { readingTime as readingTimeHelper } from '@lib/readingTime'
import { resolveUrl } from '@utils/routing'
import { useLang, get } from '@utils/use-lang'
import { Tag } from '@tryghost/content-api'
import { collections } from '@lib/collections'
import { GhostPostOrPage, GhostPostsOrPages, GhostSettings } from '@lib/ghost'

interface PreviewPostsProps {
  settings: GhostSettings
  primaryTag?: Tag | null
  posts?: GhostPostsOrPages
  prev?: GhostPostOrPage
  next?: GhostPostOrPage
}

export const PreviewPosts = ({ settings, primaryTag, posts, prev, next }: PreviewPostsProps) => {
  const text = get(useLang())
  const { url: cmsUrl } = settings
  const url = (primaryTag && resolveUrl({ cmsUrl, slug: primaryTag.slug, url: primaryTag.url })) || ''
  const primaryTagCount = primaryTag?.count?.posts

  return (
    <aside className="read-next outer">
      <div className="inner">
        <div className="read-next-feed">
          {posts && 0 < posts.length && (
            <article className="read-next-card">
              <header className="read-next-card-header">
                <h3>
                  <span>{text(`MORE_IN`)}</span>{' '}
                  <Link href={url}>
                    <a>{primaryTag?.name}</a>
                  </Link>
                </h3>
              </header>
              <div className="read-next-card-content">
                <ul>
                  {posts?.map((post, i) => (
                    <li key={i}>
                      <h4>
                        <Link href={resolveUrl({ cmsUrl, collectionPath: collections.getCollectionByNode(post), slug: post.slug, url: post.url })}>
                          <a>{post.title}</a>
                        </Link>
                      </h4>
                      <div className="read-next-card-meta">
                        <p>
                          <time dateTime={post.published_at || ''}>{dayjs(post.published_at || '').format('D MMMM, YYYY')}</time> –{' '}
                          {readingTimeHelper(post).replace(`min read`, text(`MIN_READ`))}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <footer className="read-next-card-footer">
                <Link href={url}>
                  <a>
                    {(primaryTagCount && primaryTagCount > 0 && (primaryTagCount === 1 ? `1 ${text(`POST`)}` : `${text(`SEE_ALL`)} ${primaryTagCount} ${text(`POSTS`)}`)) ||
                      text(`NO_POSTS`)}{' '}
                    →
                  </a>
                </Link>
              </footer>
            </article>
          )}

          {prev && prev.slug && <PostCard {...{ settings, post: prev }} />}

          {next && next.slug && <PostCard {...{ settings, post: next }} />}
        </div>
      </div>
    </aside>
  )
}
