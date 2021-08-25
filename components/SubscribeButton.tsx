import { getLang, get } from '@utils/use-lang'
import { useOverlay } from '@components/contexts/overlayProvider'
import { GhostSettings } from '@lib/ghost'

// The actual component
export const SubscribeButton = ({ lang }: { lang?: string }) => {
  const text = get(getLang(lang))
  const { handleOpen } = useOverlay()

  return (
    <a className="subscribe-button" onClick={handleOpen}>
      {text(`SUBSCRIBE`)}
      <style jsx>{`
        a:hover {
          text-decoration: none;
          opacity: 1;
          cursor: pointer;
        }
      `}</style>
    </a>
  )
}
