import Link from 'next/link'
import { ComponentPropsWithNode } from 'rehype-react'
import { Node } from 'unist'

import { RenderContent } from '@components/RenderContent'

interface PropertyProps {
  href?: string
}

interface LinkNode extends Node {
  children: Node[]
  properties: PropertyProps
}

export const NextLink = (props: ComponentPropsWithNode) => {
  const node = props.node as LinkNode
  const { href } = node?.properties
  const [child] = node?.children

  return (
    <>
      {!!href && (
        <Link href={href}>
          <a>
            <RenderContent htmlAst={child} />
          </a>
        </Link>
      )}
    </>
  )
}
