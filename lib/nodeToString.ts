import { Node as UnistNode } from 'unist'

interface Node extends UnistNode {
  value?: string
}

interface NodeProperties {
  className?: string[]
  style?: string | string[]
}

interface PropertiesElement extends Node {
  tagName: string
  properties?: NodeProperties
  children?: Node[]
}

export function toString(node: PropertiesElement): string {
  if ('children' in node) {
    return all(node)
  }
  return 'value' in node ? node.value || '' : ''
}

function one(node: PropertiesElement): string {
  if (node.type === 'text') {
    return node.value || ''
  }
  return 'children' in node ? all(node) : ''
}

function all(node: PropertiesElement): string {
  let index = -1
  const result = []
  if (!node.children) return ''
  while (++index < node.children.length) {
    result[index] = one(node.children[index] as PropertiesElement)
  }
  return result.join('')
}
