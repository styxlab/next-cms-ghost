import React from 'react'
import rehypeReact, { ComponentProps, ComponentPropsWithNode } from 'rehype-react'
import unified from 'unified'
import { Node } from 'unist'
import ReactGist from 'react-gist'

import { NextLink } from '@components/NextLink'
import { NextImage } from '@components/NextImage'

const gist_regex = /https:\/\/gist.github.com\/\S+\/([a-f0-9]+)\.js/g

type ScriptNode = {
  src: string
}

/* eslint-disable react/display-name */
const options = {
  createElement: React.createElement,
  Fragment: React.Fragment,
  passNode: true,
  components: {
    Link: (props: ComponentProps) => <NextLink {...(props as ComponentPropsWithNode)} />,
    Image: (props: ComponentProps) => <NextImage {...(props as ComponentPropsWithNode)} />,
    script: (props: ComponentProps) => {
      const properties = props as ScriptNode
      const myRegexp = new RegExp(gist_regex);
      const match = myRegexp.exec(properties.src);
      if (!!match && match.length > 1){
        return <ReactGist id={match[1]}/>
      }
      return null;
    }
  },
}

const renderAst = unified().use(rehypeReact, options)

interface RenderContentProps {
  htmlAst: Node | null
}

export const RenderContent = ({ htmlAst }: RenderContentProps) => {
  if (!htmlAst) return null
  return <>{renderAst.stringify(htmlAst)}</>
}

//<div className="post-content load-external-scripts">{renderAst.stringify(htmlAst)}</div>
