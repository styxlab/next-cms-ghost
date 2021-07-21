import Image from 'next/image'
import { ComponentPropsWithNode } from 'rehype-react'
import { Node } from 'unist'
import { Dimensions } from '@lib/images'

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
        <Image src={src} {...imageDimensions} {...{ className }} alt="" />
      </div>
    </div>
  )
}
