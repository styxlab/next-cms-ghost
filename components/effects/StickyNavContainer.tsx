import { RefObject, Component, createRef } from 'react'
const throttle = require(`lodash.throttle`)

interface StickyNavContainerProps {
  activeClass: string
  isPost?: boolean
  throttle: number
  render: (arg: StickyNavContainer) => JSX.Element
}

export class StickyNavContainer extends Component<StickyNavContainerProps> {
  anchorRef: RefObject<HTMLDivElement>
  activeClass: string
  isPost: boolean
  state: {
    ticking: boolean
    lastScrollY: number
    currentClass: string
  }

  constructor(props: StickyNavContainerProps) {
    super(props)
    this.scrollHandler = this.scrollHandler.bind(this)
    this.resizeHandler = this.resizeHandler.bind(this)
    this.anchorRef = createRef()
    this.activeClass = this.props.activeClass
    this.isPost = this.props.isPost || false
    this.state = {
      ticking: false,
      lastScrollY: 0,
      currentClass: ''
    }
  }

  scrollHandler = () => { }

  resizeHandler = () => { }

  componentDidMount() {
    this.scrollHandler = throttle(this.onScroll, this.props.throttle)
    this.resizeHandler = throttle(this.onScroll, this.props.throttle)

    window.addEventListener(`scroll`, this.scrollHandler, { passive: true })
    window.addEventListener(`resize`, this.resizeHandler, { passive: true })
  }

  componentWillUnmount() {
    window.removeEventListener(`scroll`, this.scrollHandler)
    window.removeEventListener(`resize`, this.resizeHandler)
  }

  onScroll = () => {
    this.setState({ lastScrollY: window.scrollY })
    this.requestTick()
  }

  requestTick = () => {
    if (!this.state.ticking) {
      requestAnimationFrame(this.update)
    }
    this.setState({ ticking: false })
  }

  update = () => {
    const current = this.anchorRef && this.anchorRef.current
    var top = current && current.getBoundingClientRect().top || 0
    var trigger = top + window.scrollY
    var triggerOffset = -20

    if (this.isPost) {
      triggerOffset = current && current.offsetHeight + 35 || 0
    }

    if (this.state.lastScrollY >= trigger + triggerOffset) {
      this.setState({ currentClass: this.activeClass })
    } else {
      this.setState({ currentClass: `` })
    }

    this.setState({ ticking: false })
  }

  render() {
    return this.props.render(this)
  }
}
