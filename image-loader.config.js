import { imageLoader } from 'next-image-loader/build/image-loader'

/**
 * This file is only of relevance when you use `next export` or a custom image loader
 *
 * When using 'next export', the plugin next-image-loader(https://github.com/aiji42/next-image-loader) will automatically use the custom image loader defined below
 * without the need to add a loader prop to <Image> tags
 */
imageLoader.loader = ({ src, width, quality }) => {
  /**
   * Customize your image loader here
   * https://nextjs.org/docs/api-reference/next/image#loader
   *
   * Example:  return `https://example.com/${src}?w=${width}&q=${quality || 75}`
   */

  return src
}
