import Image from 'next/image'

import { SiteNav } from '@components/SiteNav'
import { HeaderBackground } from '@components/HeaderBackground'
import { useLang, get } from '@utils/use-lang'

import { AvatarIcon } from '@icons/AvatarIcon'
import { GhostAuthor, GhostSettings } from '@lib/ghost'

interface HeaderAuthorProps {
  settings: GhostSettings
  author: GhostAuthor
}

export const HeaderAuthor = ({ settings, author }: HeaderAuthorProps) => {
  const { nextImages } = settings.processEnv
  const text = get(useLang())
  const twitterUrl = author.twitter ? `https://twitter.com/${author.twitter.replace(/^@/, ``)}` : null
  const facebookUrl = author.facebook ? `https://www.facebook.com/${author.facebook.replace(/^\//, ``)}` : null

  const coverImg = author.cover_image || ''
  const profileImg = author.profileImage

  const numberOfPosts = author.count?.posts

  return (
    <header className="site-archive-header">
      <div className="outer site-nav-main">
        <div className="inner">
          <SiteNav {...{ settings }} className="site-nav" />
        </div>
      </div>
      <HeaderBackground srcImg={coverImg}>
        <div className="inner">
          <div className="site-header-content author-header">
            {profileImg && nextImages.feature ? (
              <div className="author-profile-image">
                <Image
                  className="author-profile-image"
                  src={profileImg.url}
                  alt={author.name}
                  layout="responsive"
                  quality={nextImages.quality}
                  {...profileImg.dimensions}
                />
              </div>
            ) : (author.profile_image ? (
              <img className="author-profile-image" src={author.profile_image} alt={author.name} />
            ) : (
                <div className="author-profile-image">
                  <AvatarIcon />
                </div>
              ))
            }
            <div className="author-header-content">
              <h1 className="site-title">{author.name}</h1>
              {author.bio && <h2 className="author-bio">{author.bio}</h2>}
              <div className="author-meta">
                {author.location && <div className="author-location">{author.location}</div>}
                <div className="author-stats">{(numberOfPosts && ` ${numberOfPosts} ${1 < numberOfPosts ? text(`POSTS`) : text(`POST`)}`) || `${text(`NO_POSTS`)}`}</div>
                {author.website && (
                  <span className="author-social-link">
                    <a href={author.website} target="_blank" rel="noopener noreferrer">
                      {text(`WEBSITE`)}
                    </a>
                  </span>
                )}
                {twitterUrl && (
                  <span className="author-social-link">
                    <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                      Twitter
                    </a>
                  </span>
                )}
                {facebookUrl && (
                  <span className="author-social-link">
                    <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                      Facebook
                    </a>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </HeaderBackground>
    </header>
  )
}
