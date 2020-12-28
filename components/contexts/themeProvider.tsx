import { createContext, useContext, ReactElement, useState, useEffect } from 'react'
import { DarkMode } from '@appConfig'

export interface ThemeProviderValues {
  dark: DarkMode
  getDark: () => DarkMode
  toggleDark: () => void
}

const defaultValues = {
  dark: null,
  getDark: () => null,
  toggleDark: () => null
}

const ThemeContext = createContext<ThemeProviderValues>(defaultValues)
export const useTheme = (): ThemeProviderValues => useContext(ThemeContext)

// Getting dark mode information from OS!
// You need macOS Mojave + Safari Technology Preview Release 68 to test this currently.
const supportsDarkMode = () => typeof window !== 'undefined' && window.matchMedia(`(prefers-color-scheme: dark)`).matches === true

const supportsLightMode = () => typeof window !== 'undefined' && window.matchMedia(`(prefers-color-scheme: light)`).matches === true

const getLocalStoragelsDark = () => {
  if (typeof localStorage === 'undefined') return null
  const dark = localStorage.getItem(`dark`)
  if (!dark) return null
  return dark === 'dark' ? 'dark' : 'light'
}

export interface DefaultModeProps {
  defaultMode: DarkMode
  overrideOS: boolean
}

const getDefaultMode = ({ defaultMode, overrideOS }: DefaultModeProps) => {
  const lsDark = getLocalStoragelsDark()
  if (lsDark !== null) {
    return lsDark
  } else if (overrideOS) {
    return defaultMode
  } else if (supportsDarkMode()) {
    return 'dark'
  } else if (supportsLightMode()) {
    return 'light'
  } else {
    return defaultMode
  }
}

interface SitesProviderProps extends DefaultModeProps {
  children: React.ReactNode
}

export const ThemeProvider = ({ defaultMode, overrideOS, children }: SitesProviderProps): ReactElement => {
  const [dark, setDark] = useState<DarkMode>(null)

  useEffect(() => {
    setDark(getDark())
  }, [])

  const getDark = () => getDefaultMode({ defaultMode, overrideOS })

  const toggleDark = () => {
    if (dark === null) return
    const toggle = dark === 'dark' ? 'light' : 'dark'
    localStorage.setItem(`dark`, toggle)
    setDark(toggle)
  }

  return (
    <ThemeContext.Provider value={{ dark, getDark, toggleDark }}>
      {children}
    </ThemeContext.Provider>
  )
}
