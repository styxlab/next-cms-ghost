import Link from 'next/link'
import { ComponentProps } from 'rehype-react'
import { Node } from 'unist'

import { RenderContent } from '@components/RenderContent'

interface PropertyProps {
  href?: string
}

export const NextLink = (props: ComponentProps) => {
  const { href } = props.node?.properties as PropertyProps
  const [child] = props.node?.children as Node[]

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

