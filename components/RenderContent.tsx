import React from 'react'
import rehypeReact, { ComponentProps } from 'rehype-react'
import unified from 'unified'
import { Node } from 'unist'

import { NextLink } from '@components/NextLink'
import { NextImage } from '@components/NextImage'

const options = {
  createElement: React.createElement,
  Fragment: React.Fragment,
  passNode: true,
  components: {
    Link: (props: ComponentProps) => <NextLink {...props} />,
    Image: (props: ComponentProps) => <NextImage {...props} />,
  }
}

const renderAst = unified().use(rehypeReact, options)

interface RenderContentProps {
  htmlAst: Node | null
}

export const RenderContent = ({ htmlAst }: RenderContentProps) => {
  if (!htmlAst) return null
  return (
    <>
      {renderAst.stringify(htmlAst)}
    </>
  )
}

//<div className="post-content load-external-scripts">{renderAst.stringify(htmlAst)}</div>
