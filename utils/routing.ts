import { normalize } from 'path'

// higher order function
const withPrefixPath = (prefixPath: string) => (path: string) => normalize(`/${prefixPath}/${path}/`)

const trimSlash = (text: string) => text.replace(/^\//, '').replace(/\/$/, '')

const splitUrl = (url: string) => {
  // Regexp to extract the absolute part of the CMS url
  const regexp = /^(([\w-]+:\/\/?|www[.])[^\s()<>^/]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/)))/

  const [absolute] = url.match(regexp) || []
  const relative = url.split(absolute, 2).join(`/`)
  return ({ absolute, relative })
}

interface ResolveUrlProps {
  collectionPath?: string
  slug?: string,
  url?: string
}

export const resolveUrl = ({ collectionPath = `/`, slug, url }: ResolveUrlProps) => {
  const resolvePath = withPrefixPath(collectionPath)
  if (!slug || slug.length === 0) return normalize(resolvePath(`/`))
  if (!url || url.length === 0) return resolvePath(slug)
  if (trimSlash(url) === slug) return resolvePath(slug)

  const { absolute: cmsUrl, relative: dirUrl } = splitUrl(url)
  if (cmsUrl.length === 0) return resolvePath(slug)
  return resolvePath(dirUrl)
}
