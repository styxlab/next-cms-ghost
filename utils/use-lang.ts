import { lang, StringKeyObjectMap } from '@utils/lang'

const useLang = (locale: string = 'en') => {
  return lang[locale]
}

const get = (text: StringKeyObjectMap) => (name: string, fallback?: string) => {
  if (text[name] === undefined && fallback === null) {
    throw new Error(`Cannot find ${name} in lang file.`)
  }

  if (text[name] === undefined) {
    return fallback || 'UNDEFINED'
  }

  return text[name]
}

export { useLang, get }
