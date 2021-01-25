import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'

import { Layout } from '@components/Layout'
import { PostView } from '@components/PostView'
import { HeaderAuthor } from '@components/HeaderAuthor'

import { resolveUrl } from '@utils/routing'
import { SEO, authorSameAs } from '@meta/seo'

import { getAuthorBySlug, getAllAuthors, getAllSettings, getPostsByAuthor, GhostSettings, GhostPostOrPage, GhostPostsOrPages, GhostAuthor } from '@lib/ghost'
import { ISeoImage, seoImage } from '@meta/seoImage'
import { processEnv } from '@lib/processEnv'

import { BodyClass } from '@helpers/BodyClass'

/**
 * Author page (/author/:slug)
 *
 * Loads all posts for the requested author incl. pagination.
 *
 */
interface CmsData {
  author: GhostAuthor
  posts: GhostPostsOrPages
  seoImage: ISeoImage
  previewPosts?: GhostPostsOrPages
  prevPost?: GhostPostOrPage
  nextPost?: GhostPostOrPage
  settings: GhostSettings
  bodyClass: string
}

interface AuthorIndexProps {
  cmsData: CmsData
}

const AuthorIndex = ({ cmsData }: AuthorIndexProps) => {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { author, posts, settings, seoImage, bodyClass } = cmsData
  const { name, bio } = author
  const description = bio || undefined
  const sameAs = authorSameAs(author)

  return (
    <>
      <SEO {...{ settings, description, seoImage, sameAs, title: name }} />
      <Layout {...{ settings, bodyClass }} header={<HeaderAuthor {...{ settings, author }} />}>
        <PostView {...{ settings, posts }} />
      </Layout>
    </>
  )
}

export default AuthorIndex

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!(params && params.slug && Array.isArray(params.slug))) throw Error('getStaticProps: wrong parameters.')
  const [slug] = params.slug.reverse()

  const author = await getAuthorBySlug(slug)
  const posts = await getPostsByAuthor(slug)
  const settings = await getAllSettings()

  const { cover_image, profile_image } = author
  const siteUrl = settings.processEnv.siteUrl
  const imageUrl = cover_image || profile_image || undefined
  const authorImage = await seoImage({ siteUrl, imageUrl })

  return {
    props: {
      cmsData: {
        author,
        posts,
        settings,
        seoImage: authorImage,
        bodyClass: BodyClass({ author }),
      },
    },
    ...(processEnv.isr.enable && { revalidate: 1 }), // re-generate at most once every second
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const authors = await getAllAuthors()
  const settings = await getAllSettings()
  const { url: cmsUrl } = settings

  const paths = authors.map(({ slug, url }) => resolveUrl({ cmsUrl, slug, url: url || undefined })).filter((path) => path.startsWith(`/author/`))

  return {
    paths,
    fallback: processEnv.isr.enable,
  }
}
