import { parse as urlParse, UrlWithStringQuery } from 'url'
import GhostContentAPI, { Params, PostOrPage, SettingsResponse, Pagination, PostsOrPages, Tag, Author } from '@tryghost/content-api'
import { normalizePost } from '@lib/ghost-normalize'
import { Node } from 'unist'
import { collections as config } from '@routesConfig'
import { Collections } from '@lib/collections'

import { ghostAPIUrl, ghostAPIKey, processEnv, ProcessEnvProps } from '@lib/processEnv'
import { imageDimensions, normalizedImageUrl, Dimensions } from '@lib/images'
import { IToC } from '@lib/toc'

import { contactPage } from '@appConfig'

export interface NextImage {
  url: string
  dimensions: Dimensions
}

export interface NavItem {
  url: string
  label: string
}

interface BrowseResults<T> extends Array<T> {
  meta: { pagination: Pagination }
}

export interface GhostSettings extends SettingsResponse {
  processEnv: ProcessEnvProps
  secondary_navigation?: NavItem[]
  iconImage?: NextImage
  logoImage?: NextImage
  coverImage?: NextImage
}

export interface GhostTag extends Tag {
  featureImage?: NextImage
}

export interface GhostAuthor extends Author {
  profileImage?: NextImage
}

export interface GhostPostOrPage extends PostOrPage {
  featureImage?: NextImage | null
  htmlAst?: Node | null
  toc?: IToC[] | null
}

export interface GhostPostsOrPages extends BrowseResults<GhostPostOrPage> {}

export interface GhostTags extends BrowseResults<GhostTag> {}

export interface GhostAuthors extends BrowseResults<GhostAuthor> {}

const api = new GhostContentAPI({
  url: ghostAPIUrl,
  key: ghostAPIKey,
  version: 'v3',
})

const postAndPageFetchOptions: Params = {
  limit: 'all',
  include: ['tags', 'authors', 'count.posts'],
  order: ['featured DESC', 'published_at DESC'],
}

const tagAndAuthorFetchOptions: Params = {
  limit: 'all',
  include: 'count.posts',
}

const postAndPageSlugOptions: Params = {
  limit: 'all',
  fields: 'slug',
}

const excludePostOrPageBySlug = () => {
  if (!contactPage) return ''
  return 'slug:-contact'
}

// helpers
export const createNextImage = async (url?: string | null): Promise<NextImage | undefined> => {
  if (!url) return undefined
  const normalizedUrl = await normalizedImageUrl(url)
  const dimensions = await imageDimensions(normalizedUrl)
  return (dimensions && { url: normalizedUrl, dimensions }) || undefined
}

async function createNextFeatureImages(nodes: BrowseResults<Tag | PostOrPage>): Promise<GhostTags | PostsOrPages> {
  const { meta } = nodes
  const images = await Promise.all(nodes.map((node) => createNextImage(node.feature_image)))
  const results = nodes.map((node, i) => ({ ...node, ...(images[i] && { featureImage: images[i] }) }))
  return Object.assign(results, { meta })
}

async function createNextProfileImages(nodes: BrowseResults<Author>): Promise<GhostAuthors> {
  const { meta } = nodes
  const images = await Promise.all(nodes.map((node) => createNextImage(node.profile_image)))
  const results = nodes.map((node, i) => ({ ...node, ...(images[i] && { profileImage: images[i] }) }))
  return Object.assign(results, { meta })
}

export async function createNextProfileImagesFromAuthors(nodes: Author[] | undefined): Promise<Author[] | undefined> {
  if (!nodes) return undefined
  const images = await Promise.all(nodes.map((node) => createNextImage(node.profile_image)))
  return nodes.map((node, i) => ({ ...node, ...(images[i] && { profileImage: images[i] }) }))
}

async function createNextProfileImagesFromPosts(nodes: BrowseResults<PostOrPage>): Promise<PostsOrPages> {
  const { meta } = nodes
  const authors = await Promise.all(nodes.map((node) => createNextProfileImagesFromAuthors(node.authors)))
  const results = nodes.map((node, i) => ({ ...node, ...(authors[i] && { authors: authors[i] }) }))
  return Object.assign(results, { meta })
}

export async function getAllSettings(): Promise<GhostSettings> {
  //const cached = getCache<SettingsResponse>('settings')
  //if (cached) return cached
  const settings = await api.settings.browse()
  settings.url = settings?.url?.replace(/\/$/, ``)

  const iconImage = await createNextImage(settings.icon)
  const logoImage = await createNextImage(settings.logo)
  const coverImage = await createNextImage(settings.cover_image)

  const result = {
    processEnv,
    ...settings,
    ...(iconImage && { iconImage }),
    ...(logoImage && { logoImage }),
    ...(coverImage && { coverImage }),
  }
  //setCache('settings', result)
  return result
}

export async function getAllTags(): Promise<GhostTags> {
  const tags = await api.tags.browse(tagAndAuthorFetchOptions)
  return await createNextFeatureImages(tags)
}

export async function getAllAuthors() {
  const authors = await api.authors.browse(tagAndAuthorFetchOptions)
  return await createNextProfileImages(authors)
}

export async function getAllPosts(props?: { limit: number }): Promise<GhostPostsOrPages> {
  const posts = await api.posts.browse({
    ...postAndPageFetchOptions,
    filter: excludePostOrPageBySlug(),
    ...(props && { ...props }),
  })
  const results = await createNextProfileImagesFromPosts(posts)
  return await createNextFeatureImages(results)
}

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await api.posts.browse(postAndPageSlugOptions)
  return posts.map((p) => p.slug)
}

export async function getAllPages(props?: { limit: number }): Promise<GhostPostsOrPages> {
  const pages = await api.pages.browse({
    ...postAndPageFetchOptions,
    filter: excludePostOrPageBySlug(),
    ...(props && { ...props }),
  })
  return await createNextFeatureImages(pages)
}

// specific data by slug
export async function getTagBySlug(slug: string): Promise<Tag> {
  return await api.tags.read({
    ...tagAndAuthorFetchOptions,
    slug,
  })
}
export async function getAuthorBySlug(slug: string): Promise<GhostAuthor> {
  const author = await api.authors.read({
    ...tagAndAuthorFetchOptions,
    slug,
  })
  const profileImage = await createNextImage(author.profile_image)
  const result = {
    ...author,
    ...(profileImage && { profileImage }),
  }
  return result
}

export async function getPostBySlug(slug: string): Promise<GhostPostOrPage | null> {
  let result: GhostPostOrPage
  try {
    const post = await api.posts.read({
      ...postAndPageFetchOptions,
      slug,
    })
    // older Ghost versions do not throw error on 404
    if (!post) return null

    const { url } = await getAllSettings()
    result = await normalizePost(post, (url && urlParse(url)) || undefined)
  } catch (error) {
    if (error.response?.status !== 404) throw new Error(error)
    return null
  }
  return result
}

export async function getPageBySlug(slug: string): Promise<GhostPostOrPage | null> {
  let result: GhostPostOrPage
  try {
    const page = await api.pages.read({
      ...postAndPageFetchOptions,
      slug,
    })

    // older Ghost versions do not throw error on 404
    if (!page) return null

    const { url } = await getAllSettings()
    result = await normalizePost(page, (url && urlParse(url)) || undefined)
  } catch (error) {
    if (error.response?.status !== 404) throw new Error(error)
    return null
  }
  return result
}

// specific data by author/tag slug
export async function getPostsByAuthor(slug: string): Promise<GhostPostsOrPages> {
  const posts = await api.posts.browse({
    ...postAndPageFetchOptions,
    filter: `authors.slug:${slug}`,
  })
  return await createNextFeatureImages(posts)
}

export async function getPostsByTag(slug: string, limit?: number, excludeId?: string): Promise<GhostPostsOrPages> {
  const exclude = (excludeId && `+id:-${excludeId}`) || ``
  const posts = await api.posts.browse({
    ...postAndPageFetchOptions,
    ...(limit && { limit: `${limit}` }),
    filter: `tags.slug:${slug}${exclude}`,
  })
  return await createNextFeatureImages(posts)
}

// Collections
export const collections = new Collections<PostOrPage>(config)
