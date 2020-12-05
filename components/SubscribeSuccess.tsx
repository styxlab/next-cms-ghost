import { useState, useEffect } from 'react'
import { useLang, get } from '@utils/use-lang'
import { useRouter } from 'next/router'

export const SubscribeSuccess = ({ title }: { title: string }) => {
  const text = get(useLang())
  const router = useRouter()
  const { action, success } = router.query

  const [type, setType] = useState('')
  const [closeState, setCloseState] = useState('')
  const [closeButtonOpacity, setCloseButtonOpacity] = useState(0)
  const showBanner = action && action === `subscribe` && success !== undefined
  const message = success === `true` ? `${text(`SUBSCRIBED_TO`)} ${title}!` : `${text(`SUBSCRIBED_FAILED`)}`

  useEffect(() => {
    const timer = setTimeout(() => setCloseButtonOpacity(1), 1000)
    setType(
      success === `true` ? `success` : `failure`
    )
    return () => clearTimeout(timer)
  }, [setType, setCloseButtonOpacity, action])

  return (
    <div className={`subscribe-notification subscribe-${type}-message${closeState}`}>
      <style jsx>{`
        opacity: ${showBanner ? 1 : 0};
        @media (max-width: 368px) {
          padding: 5.5rem 0 2rem;
        }
        a {
          left: unset;
          right: 0;
          width: 5rem;
          opacity: ${closeButtonOpacity};
        }
        div a:hover {
          cursor: pointer;
        }
      `}</style>
      <a
        onClick={e => {
          e.preventDefault()
          setCloseState(` close`)
        }}
        className="subscribe-close-button"
      >
      </a>
      {message}
    </div>
  )
}
