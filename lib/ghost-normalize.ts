import Rehype from 'rehype'
import { Node as UnistNode, Parent } from 'unist'
import visit from 'unist-util-visit'
import { cloneDeep } from 'lodash'
import refractor from 'refractor'
import { PostOrPage } from '@tryghost/content-api'
import { Dimensions, imageDimensions } from '@lib/images'
import { generateTableOfContents } from '@lib/toc'
import { GhostPostOrPage, createNextProfileImagesFromAuthors } from './ghost'
import { parse as urlParse, UrlWithStringQuery } from 'url'
import { toString as nodeToString } from './nodeToString'

import { processEnv } from '@lib/processEnv'
const { prism, toc, nextImages } = processEnv

const rehype = Rehype().use({ settings: { fragment: true, space: `html`, emitParseErrors: false, verbose: false } })

export const normalizePost = async (post: PostOrPage, cmsUrl: UrlWithStringQuery | undefined, basePath?: string): Promise<GhostPostOrPage> => {
  if (!cmsUrl) throw Error('ghost-normalize.ts: cmsUrl expected.')
  const rewriteGhostLinks = withRewriteGhostLinks(cmsUrl, basePath)

  const processors = [rewriteGhostLinks, rewriteRelativeLinks, syntaxHighlightWithPrismJS, rewriteInlineImages]

  let htmlAst = rehype.parse(post.html || '')
  for (const process of processors) {
    htmlAst = await process(htmlAst)
  }

  const toc = tableOfContents(htmlAst)

  // image meta
  const url = post.feature_image
  const dimensions = await imageDimensions(url)

  // author images
  const authors = await createNextProfileImagesFromAuthors(post.authors)

  return {
    ...post,
    authors,
    htmlAst,
    featureImage: (url && dimensions && { url, dimensions }) || null,
    toc,
  }
}

/**
 * Rewrite absolute Ghost CMS links to relative
 */

interface Node extends UnistNode {
  value?: string
}

interface LinkElement extends Node {
  tagName: string
  properties?: HTMLAnchorElement
  children?: Node[]
}

const withRewriteGhostLinks =
  (cmsUrl: UrlWithStringQuery, basePath = '/') =>
  (htmlAst: Node) => {
    visit(htmlAst, { tagName: `a` }, (node: LinkElement) => {
      if (!node.properties) return
      const href = urlParse(node.properties.href)
      if (href.protocol === cmsUrl.protocol && href.host === cmsUrl.host) {
        node.properties.href = basePath + href.pathname?.substring(1)
      }
    })

    return htmlAst
  }

/**
 * Rewrite relative links to be used with next/link
 */

const rewriteRelativeLinks = (htmlAst: Node) => {
  visit(htmlAst, { tagName: `a` }, (node: LinkElement) => {
    const href = node.properties?.href
    if (href && !href.startsWith(`http`)) {
      const copyOfNode = cloneDeep(node)
      delete copyOfNode.properties
      delete copyOfNode.position
      copyOfNode.tagName = `span`
      node.tagName = `Link`
      node.children = [copyOfNode]
    }
  })

  return htmlAst
}

/**
 * Syntax Highlighting with PrismJS using refactor
 */

interface NodeProperties {
  className?: string[]
  style?: string | string[]
}

interface PropertiesElement extends Node {
  tagName: string
  properties?: NodeProperties
  children?: Node[]
}

interface PropertiesParent extends Parent {
  tagName?: string
}

const syntaxHighlightWithPrismJS = (htmlAst: Node) => {
  if (!prism.enable) return htmlAst

  const getLanguage = (node: PropertiesElement) => {
    const className = node.properties?.className || []

    for (const classListItem of className) {
      if (classListItem.slice(0, 9) === 'language-') {
        return classListItem.slice(9).toLowerCase()
      }
    }
    return null
  }

  visit(htmlAst, 'element', (node: PropertiesElement, _index: number, parent: PropertiesParent | undefined) => {
    if (!parent || parent.tagName !== 'pre' || node.tagName !== 'code') {
      return
    }

    const lang = getLanguage(node)
    if (lang === null) return

    let className = node.properties?.className

    let result
    try {
      className = (className || []).concat('language-' + lang)
      result = refractor.highlight(nodeToString(node), lang)
    } catch (err) {
      if (prism.ignoreMissing && /Unknown language/.test((err as Error).message)) {
        return
      }
      throw err
    }
    node.children = result
  })

  return htmlAst
}

/**
 * Table of Contents
 */

const tableOfContents = (htmlAst: Node) => {
  if (!toc.enable) return null
  return generateTableOfContents(htmlAst)
}

/**
 * Rewrite img tags to be used with next/image
 * Always attach aspectRatio for image cards
 */

interface ImageElement extends Node {
  tagName: string
  properties: HTMLImageElement
  imageDimensions: Promise<Dimensions | null> | Dimensions
}

interface ImageParent extends Parent {
  properties?: NodeProperties
}

const rewriteInlineImages = async (htmlAst: Node) => {
  let nodes: { node: ImageElement; parent: ImageParent | undefined }[] = []

  visit(htmlAst, { tagName: `img` }, (node: ImageElement, _index: number, parent: ImageParent | undefined) => {
    if (nextImages.inline) {
      node.tagName = `Image`
    }

    const { src } = node.properties
    node.imageDimensions = imageDimensions(src)
    nodes.push({ node, parent })
  })

  const dimensions = await Promise.all(nodes.map(({ node }) => node.imageDimensions))

  nodes.forEach(({ node, parent }, i) => {
    if (dimensions[i] === null) return
    node.imageDimensions = dimensions[i] as Dimensions
    const { width, height } = node.imageDimensions
    const aspectRatio = width / height
    const flex = `flex: ${aspectRatio} 1 0`
    if (parent && parent.properties) {
      let parentStyle = parent.properties.style || []
      if (typeof parentStyle === 'string') parentStyle = [parentStyle]
      parent.properties.style = [...parentStyle, flex]
    }
  })

  return htmlAst
}
