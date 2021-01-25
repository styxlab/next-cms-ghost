import { GetStaticProps, GetStaticPaths } from 'next'
import { useRouter } from 'next/router'
import { Post } from '@components/Post'
import { Page } from '@components/Page'

import { getPostsByTag, getTagBySlug, GhostPostOrPage, GhostPostsOrPages, GhostSettings } from '@lib/ghost'

import { getPostBySlug, getPageBySlug, getAllPosts, getAllPages, getAllSettings, getAllPostSlugs } from '@lib/ghost'
import { resolveUrl } from '@utils/routing'
import { collections } from '@lib/collections'

import { customPage } from '@appConfig'
import { ContactPage, defaultPage } from '@lib/contactPageDefaults'
import { imageDimensions } from '@lib/images'

import { Contact } from '@components/ContactPage'
import { ISeoImage, seoImage } from '@meta/seoImage'
import { processEnv } from '@lib/processEnv'
import { BodyClass } from '@helpers/BodyClass'

/**
 *
 * Renders a single post or page and loads all content.
 *
 */

interface CmsDataCore {
  post: GhostPostOrPage
  page: GhostPostOrPage
  contactPage: ContactPage
  settings: GhostSettings
  seoImage: ISeoImage
  previewPosts?: GhostPostsOrPages
  prevPost?: GhostPostOrPage
  nextPost?: GhostPostOrPage
  bodyClass: string
}

interface CmsData extends CmsDataCore {
  isPost: boolean
}

interface PostOrPageProps {
  cmsData: CmsData
}

const PostOrPageIndex = ({ cmsData }: PostOrPageProps) => {
  const router = useRouter()
  if (router.isFallback) return <div>Loading...</div>

  const { isPost, contactPage } = cmsData
  if (isPost) {
    return <Post {...{ cmsData }} />
  } else if (!!contactPage) {
    const { contactPage, previewPosts, settings, seoImage, bodyClass } = cmsData
    return <Contact cmsData={{ page: contactPage, previewPosts, settings, seoImage, bodyClass }} />
  } else {
    return <Page cmsData={cmsData} />
  }
}

export default PostOrPageIndex

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (!(params && params.slug && Array.isArray(params.slug))) throw Error('getStaticProps: wrong parameters.')
  const [slug] = params.slug.reverse()

  const settings = await getAllSettings()

  let post: GhostPostOrPage | null = null
  let page: GhostPostOrPage | null = null
  let contactPage: ContactPage | null = null

  post = await getPostBySlug(slug)
  const isPost = !!post
  if (!isPost) {
    page = await getPageBySlug(slug)
  } else if (post?.primary_tag) {
    const primaryTag = await getTagBySlug(post?.primary_tag.slug)
    post.primary_tag = primaryTag
  }

  // Add custom contact page
  let isContactPage = false
  if (processEnv.contactPage) {
    contactPage = { ...defaultPage, ...customPage }
    isContactPage = contactPage?.slug === slug
    if (!isContactPage) contactPage = null

    const url = contactPage?.feature_image
    if (!contactPage?.featureImage && contactPage && url) {
      const dimensions = await imageDimensions(url)
      if (dimensions) contactPage.featureImage = { url, dimensions }
    }
  }

  if (!post && !page && !isContactPage) {
    return {
      notFound: true,
    }
  }

  let previewPosts: GhostPostsOrPages | never[] = []
  let prevPost: GhostPostOrPage | null = null
  let nextPost: GhostPostOrPage | null = null

  if (isContactPage) {
    previewPosts = await getAllPosts({ limit: 3 })
  } else if (isPost && post?.id && post?.slug) {
    const tagSlug = post?.primary_tag?.slug
    previewPosts = (tagSlug && (await getPostsByTag(tagSlug, 3, post?.id))) || []

    const postSlugs = await getAllPostSlugs()
    const index = postSlugs.indexOf(post?.slug)
    const prevSlug = index > 0 ? postSlugs[index - 1] : null
    const nextSlug = index < postSlugs.length - 1 ? postSlugs[index + 1] : null

    prevPost = (prevSlug && (await getPostBySlug(prevSlug))) || null
    nextPost = (nextSlug && (await getPostBySlug(nextSlug))) || null
  }

  const siteUrl = settings.processEnv.siteUrl
  const imageUrl = (post || contactPage || page)?.feature_image || undefined
  const image = await seoImage({ siteUrl, imageUrl })

  const tags = (contactPage && contactPage.tags) || (page && page.tags) || undefined

  return {
    props: {
      cmsData: {
        settings,
        post,
        page,
        contactPage,
        isPost,
        seoImage: image,
        previewPosts,
        prevPost,
        nextPost,
        bodyClass: BodyClass({ isPost, page: contactPage || page || undefined, tags }),
      },
    },
    ...(processEnv.isr.enable && { revalidate: 1 }), // re-generate at most once every second
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const { enable, maxNumberOfPosts, maxNumberOfPages } = processEnv.isr
  const limitForPosts = (enable && { limit: maxNumberOfPosts }) || undefined
  const limitForPages = (enable && { limit: maxNumberOfPages }) || undefined
  const posts = await getAllPosts(limitForPosts)
  const pages = await getAllPages(limitForPages)
  const settings = await getAllSettings()
  const { url: cmsUrl } = settings

  const postRoutes = (posts as GhostPostsOrPages).map((post) => {
    const collectionPath = collections.getCollectionByNode(post)
    const { slug, url } = post
    return resolveUrl({ cmsUrl, collectionPath, slug, url })
  })

  let contactPageRoute: string | null = null
  if (processEnv.contactPage) {
    const contactPage = { ...defaultPage, ...customPage }
    const { slug, url } = contactPage
    contactPageRoute = resolveUrl({ cmsUrl, slug, url })
  }

  const customRoutes = (contactPageRoute && [contactPageRoute]) || []
  const pageRoutes = (pages as GhostPostsOrPages).map(({ slug, url }) => resolveUrl({ cmsUrl, slug, url }))
  const paths = [...postRoutes, ...pageRoutes, ...customRoutes]

  return {
    paths,
    fallback: enable && 'blocking',
  }
}
