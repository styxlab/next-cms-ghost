import Image from 'next/image'
import { ComponentPropsWithNode } from 'rehype-react'
import { Node } from 'unist'
import { Dimensions } from '@lib/images'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'


interface PropertyProps {
  src: string
  className?: string[]
}

interface ImageNode extends Node {
  imageDimensions: Dimensions
  properties: PropertyProps
}

export const NextImage = (props: ComponentPropsWithNode) => {
  const { node } = props
  if (!node) return null
  const imageNode = node as ImageNode
  const imageDimensions = imageNode.imageDimensions
  const { src, className: classArray } = imageNode.properties
  const className = classArray?.join(' ')

  return (
    <div className="next-image-wrapper">
      <div {...{ className }}>
        <Zoom>
          <Image src={src} {...imageDimensions} {...{ className }} alt="" />
        </Zoom>
      </div>
    </div>
  )
}
