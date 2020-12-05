import { DarkModeToggle } from '@components/DarkModeToggle'
import { GhostSettings } from '@lib/ghost'

interface DarkModeProps {
  settings: GhostSettings
}

export const DarkMode = ({ settings }: DarkModeProps) => {
  const { darkMode } = settings.processEnv
  if (darkMode.defaultMode === null) return null
  return <DarkModeToggle />
}
