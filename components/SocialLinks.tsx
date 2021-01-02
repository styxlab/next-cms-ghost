import { TwitterIcon } from '@icons/TwitterIcon'
import { FacebookIcon } from '@icons/FacebookIcon'
import { GithubIcon } from '@icons/GithubIcon'
import { LinkedinIcon } from '@icons/LinkedinIcon'

import { SocialRss } from '@components/SocialRss'
import { GhostSettings } from '@lib/ghost'

interface SocialLinkProps {
  siteUrl: string
  site: GhostSettings
}

export const SocialLinks = ({ siteUrl, site }: SocialLinkProps) => {
  const twitterUrl = site.twitter && `https://twitter.com/${site.twitter.replace(/^@/, ``)}`
  const facebookUrl = site.facebook && `https://www.facebook.com/${site.facebook.replace(/^\//, ``)}`

  return (
    <>
      {site.facebook && (
        <a href={facebookUrl} className="social-link social-link-fb" target="_blank" rel="noopener noreferrer" title="Facebook">
          <FacebookIcon />
        </a>
      )}
      {site.twitter && (
        <a href={twitterUrl} className="social-link social-link-tw" target="_blank" rel="noopener noreferrer" title="Twitter">
          <TwitterIcon />
        </a>
      )}
      <a class="social-link social-link-in" href="https://www.linkedin.com/in/miguelbernard/" title="LinkedIn" target="_blank" rel="noopener noreferrer"><LinkedinIcon/></a>
      <a class="social-link social-link-gh" href="https://github.com/mbernard/" title="Github" target="_blank" rel="noopener noreferrer"><GithubIcon/></a>
      <SocialRss {...{ siteUrl }} />
    </>
  )
}
