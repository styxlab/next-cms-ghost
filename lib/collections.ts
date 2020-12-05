import { collections as config } from '@routesConfig'

export interface Collection<T> {
  path: string,
  selector: (node: T) => boolean | null | undefined
}

export class Collections<T> {
  collections: Collection<T>[]

  constructor(config: Collection<T>[]) {
    this.collections = config
  }

  getCollectionByNode(node: T) {
    const { path } = this.collections.find(collection => collection.selector(node)) || { path: '/' }
    return path
  }
}

export const collections = new Collections(config)
