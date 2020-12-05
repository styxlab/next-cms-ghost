import { NextApiRequest, NextApiResponse } from 'next'
import { getPostBySlug } from '@lib/ghost'

/**
 *
 * Currently only posts are implemented for preview
 *
 */

// The preview mode cookies expire in 1 hour
const maxAge = 60 * 60

export async function verifySlug(slug: string): Promise<string | null> {
  const post = await getPostBySlug(slug)
  if (!post) return null
  return post.slug
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse | void> => {

  if (req.query.secret !== process.env.JAMIFY_PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const slug = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug
  const url = await verifySlug(slug)

  if (!url) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  res.setPreviewData({}, { maxAge })
  res.redirect(url)

  // TODO: Option for cookie clearing
  // res.clearPreviewData()

}
