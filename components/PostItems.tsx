import { PostCard } from '@components/PostCard'
import { GhostPostsOrPages, GhostSettings } from '@lib/ghost'

interface PostItemsProps {
  settings: GhostSettings
  posts: GhostPostsOrPages
  isHome?: boolean
}

export const PostItems = ({ settings, posts, isHome }: PostItemsProps) => (
  <>
    {posts.map((post, i) => (
      <PostCard key={i} {...{settings, post, isHome, num: i }} />
    ))}
  </>
)
