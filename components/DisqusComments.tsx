import { DiscussionEmbed } from "disqus-react"
import { GhostPostOrPage } from '@lib/ghost'

const DisqusComments = (post: GhostPostOrPage) => {
    const disqusShortname = "miguelblog-1"
    const disqusConfig = {
        url: post.url,
        identifier: post.id, // Single post id
        title: post.title // Single post title
    }
    return (
        <section>
            <DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
            />
        </section>
    )
}
export default DisqusComments;