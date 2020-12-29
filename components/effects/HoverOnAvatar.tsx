import { Component, RefObject, createRef } from 'react'

interface HoverOnAvatarProps {
  activeClass: string
  render: (arg: HoverOnAvatar) => JSX.Element
}

export class HoverOnAvatar extends Component<HoverOnAvatarProps> {
  anchorRef: RefObject<HTMLLIElement>
  activeClass: string
  hoverTimeout: NodeJS.Timeout | undefined
  state: {
    currentClass: string
  }

  constructor(props: HoverOnAvatarProps) {
    super(props)
    this.anchorRef = createRef<HTMLLIElement>()
    this.activeClass = this.props.activeClass
    this.hoverTimeout = undefined
    this.state = {
      currentClass: ''
    }
  }

  componentDidMount() {
    this.anchorRef?.current?.addEventListener(`mouseout`, this.onHoverOut, { passive: true })
    this.anchorRef?.current?.addEventListener(`mouseover`, this.onHoverIn, { passive: true })
  }

  componentWillUnmount() {
    this.hoverTimeout && clearTimeout(this.hoverTimeout)
    this.anchorRef?.current?.removeEventListener(`mouseover`, this.onHoverIn)
    this.anchorRef?.current?.removeEventListener(`mouseout`, this.onHoverOut)
  }

  onHoverIn = () => {
    this.hoverTimeout && clearTimeout(this.hoverTimeout)
    this.setState({ currentClass: this.activeClass })
  }

  onHoverOut = () => {
    // no delay for multiple authors
    this.hoverTimeout = setTimeout(() => {
      this.setState({ currentClass: `` })
    }, 50)
  }

  render() {
    return this.props.render(this)
  }
}
