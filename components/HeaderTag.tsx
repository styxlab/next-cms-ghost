import { Tag } from '@tryghost/content-api'
import { GhostSettings } from '@lib/ghost'
import { SiteNav } from '@components/SiteNav'
import { HeaderBackground } from '@components/HeaderBackground'
import { useLang, get } from '@utils/use-lang'

interface HeaderTagProps {
  settings: GhostSettings
  tag: Tag
}

export const HeaderTag = ({ settings, tag }: HeaderTagProps) => {
  const text = get(useLang())
  const featureImg = tag.feature_image || ''
  const numberOfPosts = tag.count?.posts

  return (
    <header className="site-archive-header">
      <div className="outer site-nav-main">
        <div className="inner">
          <SiteNav {...{ settings }} className="site-nav" />
        </div>
      </div>
      <HeaderBackground srcImg={featureImg}>
        <div className="inner site-header-content">
          <h1 className="site-title">{tag.name}</h1>
          <h2 className="site-description">
            {tag.description ||
              `${text(`A_COLLECTION_OF`)} ${(numberOfPosts && numberOfPosts > 0 && (numberOfPosts === 1 ? `1 ${text(`POST`)}` : `${numberOfPosts} ${text(`POSTS`)}`)) || `${text(`POSTS`)}`}`}
          </h2>
        </div>
      </HeaderBackground>
    </header>
  )
}
