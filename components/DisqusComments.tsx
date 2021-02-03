import { DiscussionEmbed } from 'disqus-react'
import { GhostPostOrPage } from '@lib/ghost'

interface DisqusCommentsProps {
  post: GhostPostOrPage
  shortname: string
}

export const DisqusComments = ({ post, shortname }: DisqusCommentsProps) => {
  const { url, id: identifier, title } = post
  const config = { url, identifier, title }

  return (
    <section>
      <DiscussionEmbed {...{ shortname, config }} />
    </section>
  )
}
