import Image from 'next/image'
import Link from 'next/link'
import { resolve } from 'url'

import { Navigation } from '@components/Navigation'
import { SocialLinks } from '@components/SocialLinks'
import { DarkMode } from '@components/DarkMode'
import { SubscribeButton } from '@components/SubscribeButton'
import { useLang, get } from '@utils/use-lang'
import { GhostSettings, NavItem, NextImage } from '@lib/ghost'

export interface SiteNavProps {
  settings: GhostSettings
  className: string
  postTitle?: string
}

export const SiteNav = ({ settings, className, postTitle }: SiteNavProps) => {
  const text = get(useLang())
  const { processEnv } = settings
  const { customNavigation, nextImages, memberSubscriptions } = processEnv
  const config: {
    overwriteNavigation: NavItem[]
    addNavigation: NavItem[]
  } = {
    overwriteNavigation: customNavigation || [],
    addNavigation: customNavigation || [],
  }
  const site = settings
  const siteUrl = settings.processEnv.siteUrl
  const title = text(`SITE_TITLE`, site.title)
  const secondaryNav = site.secondary_navigation && 0 < site.secondary_navigation.length
  const siteLogo = site.logoImage

  const navigation = site.navigation

  // overwrite navigation if specified in options
  const labels = navigation?.map((item) => item.label)
  if (labels && labels.length > 0 && config.overwriteNavigation && config.overwriteNavigation.length > 0) {
    config.overwriteNavigation.map((item) => {
      const index = (item.label && labels.indexOf(item.label)) || -1
      if (index > -1 && navigation && navigation[index]) {
        navigation[index].url = item.url
      }
    })
  }

  // add navigation if specified in options
  const urls = navigation?.map((item) => item.url)
  if (config.addNavigation && config.addNavigation.length > 0) {
    config.addNavigation.map((item) => urls?.indexOf(item.url) === -1 && navigation?.push(item))
  }

  // targetHeight is coming from style .site-nav-logo img
  const targetHeight = 21
  const calcSiteLogoWidth = (image: NextImage, targetHeight: number) => {
    const { width, height } = image.dimensions
    return (targetHeight * width) / height
  }

  return (
    <nav className={className}>
      <div className="site-nav-left-wrapper">
        <div className="site-nav-left">
          <Link href={resolve(siteUrl, '')}>
            {siteLogo && nextImages.feature ? (
              <a className="site-nav-logo">
                <div
                  style={{
                    height: '${targetHeight}px',
                    width: `${calcSiteLogoWidth(siteLogo, targetHeight)}px`,
                  }}
                >
                  <Image className="site-nav-logo" src={siteLogo.url} alt={title} layout="responsive" quality={nextImages.quality} {...siteLogo.dimensions} />
                </div>
              </a>
            ) : site.logo ? (
              <a className="site-nav-logo">
                <img src={site.logo} alt={title} />
              </a>
            ) : (
              <a className="site-nav-logo">{title}</a>
            )}
          </Link>
          <div className="site-nav-content">
            <Navigation data={navigation} />
            {postTitle && <span className={`nav-post-title ${site.logo ? `` : `dash`}`}>{postTitle}</span>}
          </div>
        </div>
      </div>
      <div className="site-nav-right">
        {secondaryNav ? (
          <Navigation data={site.secondary_navigation} />
        ) : (
          <div className="social-links">
            <SocialLinks {...{ siteUrl, site }} />
          </div>
        )}
        <DarkMode {...{ settings }} />
        {memberSubscriptions && <SubscribeButton />}
      </div>
    </nav>
  )
}
