import { PostOrPage } from '@tryghost/content-api'

const countImages = (html: string) => {
  if (!html) {
    return 0
  }
  return (html.match(/<img(.|\n)*?>/g) || []).length
}

const countWords = (text: string) => {
  if (!text) {
    return 0
  }

  text = text.replace(/<(.|\n)*?>/g, ' ') // strip any HTML tags

  const pattern = /[a-zA-ZÀ-ÿ0-9_\u0392-\u03c9\u0410-\u04F9]+|[\u4E00-\u9FFF\u3400-\u4dbf\uf900-\ufaff\u3040-\u309f\uac00-\ud7af]+/g
  const match = text.match(pattern)
  let count = 0

  if (match === null) {
    return count
  }

  for (var i = 0; i < match.length; i += 1) {
    if (match[i].charCodeAt(0) >= 0x4e00) {
      count += match[i].length
    } else {
      count += 1
    }
  }

  return count
}

interface readingTimeProps {
  wordCount: number
  imageCount: number
}

const estimatedReadingTimeInMinutes = ({ wordCount, imageCount }: readingTimeProps) => {
  const wordsPerMinute = 275
  const wordsPerSecond = wordsPerMinute / 60
  let readingTimeSeconds = wordCount / wordsPerSecond

  // add 12 seconds for the first image, 11 for the second, etc. limiting at 3
  for (var i = 12; i > 12 - imageCount; i -= 1) {
    readingTimeSeconds += Math.max(i, 3)
  }

  let readingTimeMinutes = Math.round(readingTimeSeconds / 60)

  return readingTimeMinutes
}

const readingMinutes = (html: string, additionalImages: number) => {
  if (!html) {
    return ''
  }

  let imageCount = countImages(html)
  let wordCount = countWords(html)

  if (additionalImages) {
    imageCount += additionalImages
  }

  return estimatedReadingTimeInMinutes({ wordCount, imageCount })
}

interface ReadingTimeOptions {
  minute?: string
  minutes?: string
}

export const readingTime = (post: PostOrPage, options: ReadingTimeOptions = {}) => {
  const minuteStr = typeof options.minute === 'string' ? options.minute : '1 min read'
  const minutesStr = typeof options.minutes === 'string' ? options.minutes : '% min read'

  if (!post.html || !post.reading_time) {
    return ''
  }

  let imageCount = 0

  if (post.feature_image) {
    imageCount += 1
  }

  const time = post.reading_time || readingMinutes(post.html, imageCount)
  let readingTime = ''

  if (time <= 1) {
    readingTime = minuteStr
  } else {
    readingTime = minutesStr.replace('%', `${time}`)
  }

  return readingTime
}
