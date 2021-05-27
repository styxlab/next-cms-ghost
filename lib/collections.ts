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
    const { path } = this.collections.find((collection) => collection.selector(node)) || { path: '/' }
    return path
  }

  isCollectionPath(slug: string) {
    return !!this.collections.find((collection) => collection.path === slug)
  }

  filterPostsByCollectionPath = ({ collectionPath = `/`, posts }: { collectionPath?: string; posts: T[] }) => {
    let filteredPosts = posts, foundCollection = false;
    let collection: Collection<T> | undefined;
    for (collection of this.collections) {
      if (collection.path === collectionPath) {
        foundCollection = true;
        break;
      }
      filteredPosts = filteredPosts.filter((post) => !collection!.selector(post))
    }
    if (foundCollection) {
      return filteredPosts.filter((post)=> collection!.selector(post))
    }
    return filteredPosts
  }
}

export const collections = new Collections(config)
