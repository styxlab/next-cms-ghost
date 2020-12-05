
import { CSSProperties } from 'react'

import { useOverlay } from '@components/contexts/overlayProvider'
import { GhostSettings } from '@lib/ghost'
import { useLang, get } from '@utils/use-lang'
import { siteIcon } from '@meta/siteDefaults'

import { SubscribeForm } from '@components/SubscribeForm'

export const SubscribeOverlay = ({ settings }: { settings: GhostSettings }) => {
  const text = get(useLang())
  const { isOpen, handleClose } = useOverlay()

  const title = text(`SITE_TITLE`, settings.title)
  const siteLogo = settings.logo || siteIcon
  const openingStyle: CSSProperties = { opacity: 1, pointerEvents: `auto` }
  const closingStyle: CSSProperties = { opacity: 0, pointerEvents: `none` }

  return (
    <div className="subscribe-overlay" style={isOpen ? openingStyle : closingStyle} >
      <a className="subscribe-close-overlay" onClick={handleClose}></a>
      <a className="subscribe-close-button" onClick={handleClose}></a>
      <div className="subscribe-overlay-content">
        {siteLogo &&
          <img className="subscribe-overlay-logo" src={siteLogo} alt={title} />
        }
        <div className="subscribe-form">
          <h1 className="subscribe-overlay-title">{text(`SUBSCRIBE_TO`)} {title}</h1>
          <p className="subscribe-overlay-description">{text(`SUBSCRIBE_OVERLAY`)}</p>
          <SubscribeForm {...{ settings }} />
        </div>
      </div>
    </div>
  )
}
