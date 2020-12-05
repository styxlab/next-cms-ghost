import { GhostSettings } from "@lib/ghost"
import { useLang, get } from '@utils/use-lang'
import { useOverlay } from '@components/contexts/overlayProvider'

import { LoaderIcon } from '@icons/LoaderIcon'

export const SubscribeForm = ({ settings }: { settings: GhostSettings }) => {
  const text = get(useLang())
  const { message, handleSubmit, email, handleChange } = useOverlay()

  return (
    <form className={message} data-members-form="subscribe" onSubmit={ev => handleSubmit(ev, settings.url)}>
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
      <div className="message-success">
        <strong>{`${text(`GREAT`)}!`}</strong> {text(`CHECK_YOUR_INBOX`)}.
        </div>
      <div className="message-error">
        {text(`ENTER_VALID_EMAIL`)}!
      </div>
    </form>
  )
}
