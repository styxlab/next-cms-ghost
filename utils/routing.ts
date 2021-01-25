// higher order function
const withPrefixPath = (prefixPath: string) => (path: string) => normalizePath(`/${prefixPath}/${path}/`)

const trimSlash = (text: string) => text.replace(/^\//, '').replace(/\/$/, '')

const normalizePath = (path: string) => {
  const normalize = `/${trimSlash(path)}/`
  return normalize.replace(`////`, `/`).replace(`///`, `/`).replace(`//`, `/`)
}

//const splitUrl = (url: string) => {
//  // Regexp to extract the absolute part of the CMS url
//  const regexp = /^(([\w-]+:\/\/?|www[.])[^\s()<>^/]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/)))/
//
//  const [absolute] = url.match(regexp) || []
//  const relative = url.split(absolute, 2).join(`/`)
//  return { absolute, relative }
//}

interface ResolveUrlProps {
  cmsUrl?: string
  collectionPath?: string
  slug?: string
  url?: string
}

export const resolveUrl = ({ cmsUrl, collectionPath = `/`, slug, url }: ResolveUrlProps) => {
  const resolvePath = withPrefixPath(collectionPath)

  if (!slug || slug.length === 0) return normalizePath(resolvePath(`/`))

  if (!cmsUrl || cmsUrl.length === 0) return resolvePath(slug)
  if (!url || url.length === 0) return resolvePath(slug)
  if (trimSlash(url) === slug) return resolvePath(slug)
  if (!url.startsWith(cmsUrl)) return resolvePath(slug)

  //const { absolute: cmsUrl, relative: dirUrl } = splitUrl(url)
  const dirUrl = url.replace(cmsUrl, '/').replace('//', '/')
  return resolvePath(dirUrl)
}
