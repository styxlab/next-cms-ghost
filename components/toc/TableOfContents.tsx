import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useActiveHash } from '@components/effects/UseActiveHash'
import { IToC } from '@lib/toc'
import { useLang, get } from '@utils/use-lang'

const getHeadingIds = (toc: IToC[], traverseFullDepth = true, maxDepth: number, recursionDepth = 1): string[] => {
    const idList = []

    if (toc) {
        for (const item of toc) {
            item.id && idList.push(item.id)

            if (item.items && traverseFullDepth && recursionDepth < (maxDepth || 6)) {
                idList.push(
                    ...getHeadingIds(item.items, true, maxDepth, recursionDepth + 1)
                )
            }
        }
    }
    return idList
}

const isUnderDepthLimit = (depth: number, maxDepth: number) => (maxDepth === null ? true : depth < maxDepth)

const createItems = (toc: IToC[], url: string, depth: number, maxDepth: number, activeHash: string, isDesktop: boolean) => (
    toc.map((head, index) => {
        const isActive = isDesktop && head.id === `${activeHash}`
        return (
            <li key={`${url}#${head.id}-${depth}-${index}`}>
                {head.id &&
                  <Link href={`${url}#${head.id}`}>
                    <a className={isActive ? 'link active' : 'link'}>
                      {head.heading}
                    </a>
                  </Link>
                }
                {head.items && isUnderDepthLimit(depth, maxDepth) &&
                    <ul className="sub">
                        {createItems(head.items, url, depth + 1, maxDepth, activeHash, isDesktop)}
                    </ul>
                }
            </li>
        )
    })
)

interface TableOfContentsProps {
  toc: IToC[]
  url: string
  maxDepth?: number
}

export const TableOfContents = ({ toc, url, maxDepth = 2 }: TableOfContentsProps) => {
    const text = get(useLang())

    const [isDesktop, setIsDesktop] = useState(false)
    const activeHash = useActiveHash(getHeadingIds(toc, true, maxDepth))

    useEffect(() => {
        const isDesktopQuery = window.matchMedia(`(min-width: 1170px)`)
        setIsDesktop(isDesktopQuery.matches)

        const updateIsDesktop = (e: MediaQueryListEvent ) => setIsDesktop(e.matches)
        isDesktopQuery.addListener(updateIsDesktop)
        return () => isDesktopQuery.removeListener(updateIsDesktop)
    }, [])

    return (
        <>
            { toc.length > 0 ? (
                    <aside className="toc">
                        <nav>
                            <h2>
                                {text(`TABLE_OF_CONTENTS`)}
                            </h2>
                            <ul className="list">
                                {createItems(toc, url, 1, maxDepth, activeHash, isDesktop)}
                            </ul>
                        </nav>
                    </aside>
            ) : (
                null
            )}
        </>
    )
}
