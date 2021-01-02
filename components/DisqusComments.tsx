import { DiscussionEmbed } from "disqus-react"

const DisqusComments = ({ post }: GhostPostOrPage) => {
    const disqusShortname = "miguelblog-1"
    const disqusConfig = {
        url: post.url,
        identifier: post.id, // Single post id
        title: post.title // Single post title
    }
    return (
        <div>
            <DiscussionEmbed
                shortname={disqusShortname}
                config={disqusConfig}
            />
        </div>
    )
}
export default DisqusComments;