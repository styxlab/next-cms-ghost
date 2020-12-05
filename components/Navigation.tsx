import Link from 'next/link'
import { ReactFragment } from 'react'
import { NavItem } from '@lib/ghost'

/**
 * Navigation component
 *
 * The Navigation component takes an array of your Ghost
 * navigation property that is fetched from the settings.
 * It differentiates between absolute (external) and relative link (internal).
 * You can pass it a custom class for your own styles, but it will always fallback
 * to a `site-nav-item` class.
 *
 */

interface NavigationProps {
  data?: NavItem[]
  navClass?: string
}

export const Navigation = ({ data, navClass }: NavigationProps) => {
  const items: ReactFragment[] = []

  data?.map((navItem, i) => {
    if (navItem.url.match(/^\s?http(s?)/gi)) {
      items.push(
        <li key={i} className={`nav-${navItem.label.toLowerCase()}`} role="menuitem">
          <a className={navClass} href={navItem.url} target="_blank" rel="noopener noreferrer">
            {navItem.label}
          </a>
        </li>
      )
    } else {
      items.push(
        <li key={i} className={`nav-${navItem.label.toLowerCase()}`} role="menuitem">
          <div className={navClass}>
            <Link href={navItem.url} >
              <a>{navItem.label}</a>
            </Link>
          </div>
        </li>
      )
    }
  })

  return (
    <ul className="nav" role="menu">
      {items}
    </ul>
  )
}
