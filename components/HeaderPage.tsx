import { GhostSettings } from '@lib/ghost'
import { SiteNav } from '@components/SiteNav'

interface HeaderPageProps {
  settings: GhostSettings
}

export const HeaderPage = ({ settings }: HeaderPageProps) => (
  <header className="site-header">
    <div className="outer site-nav-main">
      <div className="inner">
        <SiteNav {...{ settings }} className="site-nav" />
      </div>
    </div>
  </header>
)
