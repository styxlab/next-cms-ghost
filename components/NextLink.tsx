import Link from 'next/link'
import { ComponentProps, ComponentPropsWithNode } from 'rehype-react'
import { Node } from 'unist'

import { RenderContent } from '@components/RenderContent'

interface PropertyProps {
  href?: string
}

export const NextLink = (props: ComponentProps) => {
  const { node } = props as ComponentPropsWithNode
  if (!node) return null
  const { href } = node?.properties as PropertyProps
  const [child] = node?.children as Node[]

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

