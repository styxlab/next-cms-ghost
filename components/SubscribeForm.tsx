import { GhostSettings } from "@lib/ghost"
import { useLang, get } from '@utils/use-lang'
import { useOverlay } from '@components/contexts/overlayProvider'
import MailchimpSubscribe from "react-mailchimp-subscribe"

import { LoaderIcon } from '@icons/LoaderIcon'

const url = "https://miguelbernard.us19.list-manage.com/subscribe/post?u=da6d67bd7f3ba3a760d0dd2a6&amp;id=ce423cd6f3"

export const SubscribeForm = ({ settings }: { settings: GhostSettings }) => {
  const text = get(useLang())
  const { email, handleChange, handleClose } = useOverlay()

  return (
    <MailchimpSubscribe url={url} render={({ subscribe, status, message }) => {
      switch (status) {
        case "sending":
          return (
            <div>
              <LoaderIcon />
              <div>Sending...</div>
            </div>
          )
        case "success":
          setTimeout(handleClose, 5000)
          return (
            <div>
              <strong>{`Thank you! Check your inbox to confirm your subscription.`}</strong>.
            </div>
          )
        case "error":
          return (
            <form data-members-form="subscribe" onSubmit={ev => {
              ev.preventDefault
              subscribe({
                EMAIL: email,
              })
            }}>
              <div className="form-group">
                <label htmlFor="email">
                  {text(`EMAIL`)}
                  <style jsx>{`
                        position: absolute;
                        height: 1px;
                        width: 1px;
                        clip: rect(1px,1px,1px,1px);
                        border: 0;
                        overflow: hidden;
                      `}</style>
                </label>
                <input id="email" name="email" type="email" value={email}
                  onChange={handleChange} className="subscribe-email"
                  data-members-email placeholder={text(`YOUR_EMAIL`)} autoComplete="false" />
                <button className="button primary" type="submit" value="Submit">
                  <span className="button-content">{text(`SUBSCRIBE`)}</span>
                  <span className="button-loader"><LoaderIcon /></span>
                </button>
              </div>
              <div dangerouslySetInnerHTML={{ __html: message?.toString() || '' }} />
            </form>
          )
        default:
          return (
            <form data-members-form="subscribe" onSubmit={ev => {
              ev.preventDefault
              subscribe({
                EMAIL: email,
              })
            }}>
              <div className="form-group">
                <label htmlFor="email">
                  {text(`EMAIL`)}
                  <style jsx>{`
                        position: absolute;
                        height: 1px;
                        width: 1px;
                        clip: rect(1px,1px,1px,1px);
                        border: 0;
                        overflow: hidden;
                      `}</style>
                </label>
                <input id="email" name="email" type="email" value={email}
                  onChange={handleChange} className="subscribe-email"
                  data-members-email placeholder={text(`YOUR_EMAIL`)} autoComplete="false" />
                <button className="button primary" type="submit" value="Submit">
                  <span className="button-content">{text(`SUBSCRIBE`)}</span>
                  <span className="button-loader"><LoaderIcon /></span>
                </button>
              </div>
            </form>
          )
      }
    }}
    />
  )
}