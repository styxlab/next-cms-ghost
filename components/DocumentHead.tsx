import { GhostSettings } from 'lib/ghost'
import { Helmet } from 'react-helmet'
import { useRouter } from 'next/router'
import { useTheme } from '@components/contexts/themeProvider'
import { DarkMode } from '@appConfig'

interface DocumentHeadProps {
  site: GhostSettings
  className: string
}

interface ClassProps {
  className: string
}

interface AddDarkClassProps extends ClassProps {
  dark: DarkMode
}

interface AddActionClassProps extends ClassProps {
  action?: string | string[]
  success?: string | string[]
}

const addDarkClass = ({ className, dark }: AddDarkClassProps) => (
  `${className} ${dark === `dark` ? dark : ``}`
)

const addActionClass = ({ className, action = `ssr`, success }: AddActionClassProps) => {
  if (!success || Array.isArray(action) || Array.isArray(success)) {
    return className
  }
  return (
    `${className} ${action === `subscribe` ? success === `true` ? ` subscribe-success` : ` subscribe-failure` : ``}`
  )
}

export const DocumentHead = ({ site, className }: DocumentHeadProps) => {
  const { getDark } = useTheme()
  const router = useRouter()
  const { action, success } = router.query
  const cln = addActionClass({ className, action, success })

  const dark = getDark()
  const bodyClass = addDarkClass({ className: cln, dark })

  return (
    <Helmet>
      <html lang={site.lang} className="casper" />
      <body className={bodyClass} />
    </Helmet>
  )
}
