import fs from 'fs'
import path from 'path'
import { fileCache } from '@appConfig'

const cacheRoot = path.join(process.cwd(), '.cache')

const makeDirectory = (path: string) => {
  if (fs.existsSync(path)) return true
  try {
    fs.mkdirSync(path)
  } catch {
    return false
  }
  return true
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
  if (!makeDirectory(cacheRoot)) return

  const filePath = path.join(cacheRoot, `${key}.txt`)
  fs.writeFileSync(filePath, JSON.stringify(object as JSON))
}
