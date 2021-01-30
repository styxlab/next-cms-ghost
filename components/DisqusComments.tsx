import { DiscussionEmbed } from "disqus-react"
import { GhostPostOrPage } from '@lib/ghost'

interface DisqusCommentsProps {
    post: GhostPostOrPage
    shortname: string
  }

const DisqusComments = (props: DisqusCommentsProps) => {
    const disqusConfig = {
        url: props.post.url,
        identifier: props.post.id, // Single post id
        title: props.post.title // Single post title
    }
    return (
        <section>
            <DiscussionEmbed
                shortname={props.shortname}
                config={disqusConfig}
            />
        </section>
    )
}
export default DisqusComments;