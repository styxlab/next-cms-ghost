import { useRouter } from 'next/router'

import { Tag } from '@tryghost/content-api'
import { GetStaticProps, GetStaticPaths } from 'next'
import { HeaderTag } from '@components/HeaderTag'
import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { SEO } from '@meta/seo'

import { getTagBySlug, getAllTags, getAllSettings, getPostsByTag, GhostSettings, GhostPostOrPage, GhostPostsOrPages } from '@lib/ghost'
import { resolveUrl } from '@utils/routing'
import { ISeoImage, seoImage } from '@meta/seoImage'
import { processEnv } from '@lib/processEnv'

import { BodyClass } from '@helpers/BodyClass'

/**
 * Tag page (/tag/:slug)
 *
 * Loads all posts for the requested tag incl. pagination.
 *
 */

interface CmsData {
  tag: Tag
  posts: GhostPostsOrPages
  seoImage: ISeoImage
  previewPosts?: GhostPostsOrPages
  prevPost?: GhostPostOrPage
  nextPost?: GhostPostOrPage
  settings: GhostSettings
  bodyClass: string
}

interface TagIndexProps {
  cmsData: CmsData
}

const TagIndex = ({ cmsData }: TagIndexProps) => {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { tag, posts, settings, seoImage, bodyClass } = cmsData
  const { meta_title, meta_description } = tag

  return (
    <>
      <SEO {...{ settings, meta_title, meta_description, seoImage }} />
      <Layout {...{ settings, bodyClass }} header={<HeaderTag {...{ settings, tag }} />}>
        <PostView {...{ settings, posts }} />
      </Layout>
    </>
  )
}

export default TagIndex

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!(params && params.slug && Array.isArray(params.slug))) throw Error('getStaticProps: wrong parameters.')
  const [slug] = params.slug.reverse()

  const tag = await getTagBySlug(slug)
  const posts = await getPostsByTag(slug)
  const settings = await getAllSettings()

  return {
    props: {
      cmsData: {
        tag,
        posts,
        settings,
        seoImage: await seoImage({ siteUrl: settings.processEnv.siteUrl }),
        bodyClass: BodyClass({ tags: [tag] }),
      },
    },
    ...(processEnv.isr.enable && { revalidate: 1 }), // re-generate at most once every second
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const tags = await getAllTags()
  const settings = await getAllSettings()
  const { url: cmsUrl } = settings

  const paths = tags.map(({ slug, url }) => resolveUrl({ cmsUrl, slug, url })).filter((path) => path.startsWith(`/tag/`))

  return {
    paths,
    fallback: processEnv.isr.enable,
  }
}
