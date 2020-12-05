import { useLang, get } from '@utils/use-lang'
import { useOverlay } from '@components/contexts/overlayProvider'

// The actual component
export const SubscribeButton = () => {
  const text = get(useLang())
  const { handleOpen } = useOverlay()

  return (
    <a className="subscribe-button" onClick={handleOpen}>
      {text(`SUBSCRIBE`)}
      <style jsx>{`
        a:hover {
          text-decoration: none;
          opacity: 1;
          cursor: pointer
        }
      `}</style>
    </a>
  )
}
