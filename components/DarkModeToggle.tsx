import { useTheme } from '@components/contexts/themeProvider'
import { useLang, get } from '@utils/use-lang'
import { MoonIcon } from '@icons/MoonIcon'
import { SunIcon } from '@icons/SunIcon'

export const DarkModeToggle = () => {
  const { dark, toggleDark } = useTheme()
  const text = get(useLang())

  return (
    <button className="social-link social-link-tw" onClick={toggleDark} title={text(`DARK_MODE`)} style={{ backgroundColor: 'transparent' }}>
      {dark === null ? <svg viewBox="0 0 512 512"></svg> : dark === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
