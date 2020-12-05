import { Tag } from "@tryghost/content-api"

interface PostClassProps {
  tags: Tag[] | undefined
  isFeatured?: boolean
  isImage?: boolean
  isPage?: boolean
}

export const PostClass = ({ tags, isFeatured, isImage, isPage }: PostClassProps) => {
  let classes = [`post`]

  isFeatured = isFeatured || false
  isImage = isImage || false
  isPage = isPage || false

  if (tags && tags.length > 0) {
    classes = classes.concat(tags.map((tag) => (`tag-` + tag.slug)))
  }

  if (isFeatured) {
    classes.push(`featured`)
  }

  if (!isImage) {
    classes.push(`no-image`)
  }

  if (isPage) {
    classes.push(`page`)
  }

  const result = classes.reduce((memo, item) => (memo + ` ` + item), ``)

  return result.trim()
}
