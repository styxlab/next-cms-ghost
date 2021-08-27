import { useTheme } from '@components/contexts/themeProvider'
import { getLang, get } from '@utils/use-lang'
import { MoonIcon } from '@icons/MoonIcon'
import { SunIcon } from '@icons/SunIcon'

export const DarkModeToggle = ({ lang }: { lang?: string }) => {
  const { dark, toggleDark } = useTheme()
  const text = get(getLang(lang))

  return (
    <button className="social-link social-link-tw" onClick={toggleDark} title={text(`DARK_MODE`)} style={{ backgroundColor: 'transparent' }}>
      {dark === null ? <svg viewBox="0 0 512 512"></svg> : dark === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
