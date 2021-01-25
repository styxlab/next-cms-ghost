import { NextApiRequest, NextApiResponse } from 'next'
import { getAllSettings, getPostBySlug } from '@lib/ghost'
import { resolveUrl } from '@utils/routing'
import { collections } from '@lib/collections'

/**
 *
 * Currently only posts are implemented for preview
 *
 */

// The preview mode cookies expire in 1 hour
const maxAge = 60 * 60

export async function verifySlug(postSlug: string): Promise<string | null> {
  const post = await getPostBySlug(postSlug)
  if (!post) return null

  const collectionPath = collections.getCollectionByNode(post)
  const { slug, url } = post

  const settings = await getAllSettings()
  const { url: cmsUrl } = settings
  return resolveUrl({ cmsUrl, collectionPath, slug, url })
}

export default async (req: NextApiRequest, res: NextApiResponse): Promise<NextApiResponse | void> => {
  if (req.query.secret !== process.env.JAMIFY_PREVIEW_TOKEN || !req.query.slug) {
    return res.status(401).json({ message: 'Invalid token' })
  }

  const slug = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug
  const url = await verifySlug(slug)
  console.log(url)

  if (!url) {
    return res.status(401).json({ message: 'Invalid slug' })
  }

  res.setPreviewData({}, { maxAge })
  res.redirect(url)

  // TODO: Option for cookie clearing
  // res.clearPreviewData()
}
