import { DiscussionEmbed } from 'disqus-react'
import { GhostPostOrPage } from '@lib/ghost'
import { resolvePostFullPath } from '@utils/routing'

interface DisqusCommentsProps {
  post: GhostPostOrPage
  shortname: string
  siteUrl: string
}

export const DisqusComments = ({ post, shortname, siteUrl }: DisqusCommentsProps) => {
  const url = resolvePostFullPath(siteUrl, post.slug)
  const { id: identifier, title } = post
  const config = { url, identifier, title }

  return (
    <section>
      <DiscussionEmbed {...{ shortname, config }} />
    </section>
  )
}
