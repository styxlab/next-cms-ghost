import fs from 'fs'
import path from 'path'
import { fileCache } from '@appConfig'

const cacheRoot = path.join(process.cwd(), '.cache')
if (!fs.existsSync(cacheRoot)) {
  fs.mkdirSync(cacheRoot)
}

export function getCache<T>(key: string | null): T | null {
  if (!fileCache || !key) return null

  const filePath = path.join(cacheRoot, `${key}.txt`)
  if (fs.existsSync(filePath)) {
    const value = fs.readFileSync(filePath)
    return JSON.parse(value.toString()) as T
  }

  return null
}

export function setCache(key: string | null, object: unknown): void {
  if (!fileCache || !key) return

  const filePath = path.join(cacheRoot, `${key}.txt`)
  fs.writeFileSync(filePath, JSON.stringify(object as JSON))
}
