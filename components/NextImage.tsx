import Image from 'next/image'
import { ComponentPropsWithNode } from 'rehype-react'
import { Dimensions } from '@lib/images'

interface PropertyProps {
  src: string
  className?: string[]
}

export const NextImage = (props: ComponentPropsWithNode) => {
  const { node } = props
  if (!node) return null
  const imageDimensions = node.imageDimensions as Dimensions
  const { src, className: classArray } = node.properties as PropertyProps
  const className = classArray?.join(' ')

  return (
    <div className="next-image-wrapper">
      <div {...{ className }}>
        <Image src={src} {...imageDimensions} {...{ className }} />
      </div>
    </div>
  )
}
