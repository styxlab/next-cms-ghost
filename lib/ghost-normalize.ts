import Rehype from 'rehype'
import { Node, Parent } from 'unist'
import visit from 'unist-util-visit'
import { cloneDeep, upperCase } from 'lodash'
import refractor from 'refractor'
import nodeToString from 'hast-util-to-string'
import { PostOrPage } from '@tryghost/content-api'
import { Dimensions, imageDimensions } from '@lib/images'
import { generateTableOfContents } from '@lib/toc'
import { GhostPostOrPage, createNextProfileImagesFromAuthors } from './ghost'

import { processEnv } from '@lib/processEnv'
const { prism, toc, nextImages } = processEnv

const rehype = Rehype().use({ settings: { fragment: true, space: `html`, emitParseErrors: false, verbose: false } })

export const normalizePost = async (post: PostOrPage, cmsUrl: string | undefined, basePath?: string): Promise<GhostPostOrPage> => {
  if (!cmsUrl) throw Error('ghost-normalize.ts: cmsUrl expected.')
  const rewriteGhostLinks = withRewriteGhostLinks(cmsUrl, basePath)

  const processors = [
    rewriteMvpLinks,
    rewriteGhostLinks,
    // rewriteRelativeLinks,
    syntaxHighlightWithPrismJS,
    rewriteInlineImages
  ]

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
 * Rewrite Microsoft link to include my MVP tracking id
 */

const rewriteMvpLinks = (htmlAst: Node) => {
  visit(htmlAst, { tagName: `a` }, (node: Node) => {
    const href = (node.properties as HTMLAnchorElement).href
    try {
      var url = new URL(href);
      if (url.hostname.endsWith('microsoft.com') 
          || url.hostname.endsWith('azure.com')
          || url.hostname.endsWith('linkedin.com')
          || url.hostname.endsWith('github.com')) {
        url.searchParams.set("WT.mc_id", "DOP-MVP-5003880");
        (node.properties as HTMLAnchorElement).href = url.href
      }
    }
    catch { }
  })

  return htmlAst
}

/**
 * Rewrite absolute Ghost CMS links to relative
 */

const withRewriteGhostLinks = (cmsUrl: string, basePath = '/') => (htmlAst: Node) => {
  visit(htmlAst, { tagName: `a` }, (node: Node) => {
    const href = (node.properties as HTMLAnchorElement).href
    if (href?.startsWith(cmsUrl)) {
      ;(node.properties as HTMLAnchorElement).href = href.replace(cmsUrl, basePath).replace('//', '/')
    }
  })

  return htmlAst
}

/**
 * Rewrite relative links to be used with next/link
 */

const rewriteRelativeLinks = (htmlAst: Node) => {
  visit(htmlAst, { tagName: `a` }, (node: Node) => {
    const href = (node.properties as HTMLAnchorElement).href
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

const syntaxHighlightWithPrismJS = (htmlAst: Node) => {
  if (!prism.enable) return htmlAst

  visit(htmlAst, 'element', (node: Node, _index: number, parent: Parent | undefined) => {
    if (node.tagName !== 'pre') {
      return
    }

    // hack to enable the 'line-numbers' plugins
    let className = (node.properties as NodeProperties).className;
    (node.properties as NodeProperties).className = (className || []).concat('line-numbers');
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

const rewriteInlineImages = async (htmlAst: Node) => {
  let nodes: { node: Node; parent: Parent | undefined }[] = []

  visit(htmlAst, { tagName: `img` }, (node: Node, _index: number, parent: Parent | undefined) => {
    if (nextImages.inline) {
      node.tagName = `Image`
    }

    const { src } = node.properties as HTMLImageElement
    node.imageDimensions = imageDimensions(src)
    nodes.push({ node, parent })
  })

  const dimensions = await Promise.all(nodes.map(({ node }) => node.imageDimensions))

  nodes.forEach(({ node, parent }, i) => {
    node.imageDimensions = dimensions[i]
    if (dimensions[i] === null) return
    const { width, height } = dimensions[i] as Dimensions
    const aspectRatio = width / height
    const flex = `flex: ${aspectRatio} 1 0`
    if (parent) {
      let parentStyle = (parent.properties as NodeProperties).style || []
      if (typeof parentStyle === 'string') parentStyle = [parentStyle]
      ;(parent.properties as NodeProperties).style = [...parentStyle, flex]
    }
  })

  return htmlAst
}
