import { createContext, useContext, ReactElement, useState, useEffect, ChangeEvent, FormEvent, MouseEvent } from 'react'

export interface OverlayProviderValues {
  isOpen: boolean
  handleClose: () => void
  handleOpen: (event: MouseEvent<HTMLAnchorElement>) => void
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (event: FormEvent<HTMLFormElement>, cmsUrl: string | undefined) => void
  email: string
  message: string
}

const defaultValues = {
  isOpen: false,
  handleClose: () => null,
  handleOpen: () => null,
  handleChange: () => null,
  handleSubmit: () => null,
  email: '',
  message: ''
}

const OverlayContext = createContext<OverlayProviderValues>(defaultValues)
export const useOverlay = (): OverlayProviderValues => useContext(OverlayContext)

export interface DefaultModeProps {
}

interface OverlayProviderProps extends DefaultModeProps {
  children: React.ReactNode
}

export const OverlayProvider = ({ children }: OverlayProviderProps): ReactElement => {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const escFunction = (event: globalThis.KeyboardEvent) => {
    if (event.key === `Escape`) {
      handleClose()
    }
  }

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleOpen = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    setIsOpen(true)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>, cmsUrl: string = '') => {
    event.preventDefault()
    const postURL = `${cmsUrl}/members/api/send-magic-link/`

    const values = {
      email,
      emailType: `subscribe`,
      labels: [],
    }

    try {
      fetch(postURL, {
        method: `POST`,
        mode: `cors`,
        headers: { 'Content-Type': `application/json` },
        body: JSON.stringify(values),
      })
    } catch {
      setMessage(`error`)
    }
    setMessage(`success`)
  }

  useEffect(() => {
    window.addEventListener(`keydown`, escFunction, false)
    return function cleanup() {
      window.removeEventListener(`keydown`, escFunction, false)
    }
  }, [])

  return (
    <OverlayContext.Provider value={{ isOpen, handleOpen, handleClose, handleSubmit, handleChange, email, message }}>
      {children}
    </OverlayContext.Provider>
  )
}
