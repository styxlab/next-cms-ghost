import probe from 'probe-image-size'
import { getCache, setCache } from '@lib/cache'

/**
 * Determine image dimensions
 *
 * probe-image-size reacts sensitivily on bad network connections
 * See: https://github.com/nodeca/probe-image-size/issues/46
 * Frequent fails signify bad network connections
 *
 * Current measures:
 *
 * 1. Caching results to fs
 * 2. Retries on fail
 * 3. Reduced network timeouts to speed up retries
 *
 */

const maxRetries = 50
const read_timeout = 3000 // ms
const response_timeout = 3000 // ms

export interface Dimensions {
  width: number
  height: number
}

export const imageDimensions = async (url: string | undefined | null, noCache?: boolean): Promise<Dimensions | null> => {
  if (!url) return null

  const cacheKey = !noCache && encodeURIComponent(url) || null
  const cached = getCache<Dimensions>(cacheKey)
  if (cached) return cached

  let width = 0
  let height = 0

  let hasError: boolean
  let retry = 0

  do {
    try {
      const { width: w, height: h } = await probe(url, {
        read_timeout,
        response_timeout,
      })
      width = w
      height = h
      hasError = false
    } catch (error) {
      const { code } = error

      hasError = true
      retry = retry + 1

      if (code === 'ECONTENT') {
        // no content: width + height = 0
        hasError = false
      }
      if (!['ECONNRESET', 'ECONTENT'].includes(code)) {
        console.warn(`images.ts: Error while probing image with url: ${url}.`)
        throw new Error(error)
      }
      //console.warn(`images.ts: Network error while probing image with url: ${url}.`)

    }
  } while (hasError && retry < maxRetries)
  if (hasError) throw new Error(`images.ts: Bad network connection. Failed image probe after ${maxRetries} retries.`)
  if (0 === width + height) return null

  setCache(cacheKey, { width, height })
  return { width, height }
}

export const imageDimensionsFromFile = async (file: string, noCache?: boolean) => {
  if (!file) return null

  const cacheKey = !noCache && encodeURIComponent(file) || null
  const cached = getCache<Dimensions>(cacheKey)
  if (cached) return cached

  const { width, height } = await probe(require('fs').createReadStream(file))
  if (0 === width + height) return null

  setCache(cacheKey, { width, height })
  return { width, height }
}
