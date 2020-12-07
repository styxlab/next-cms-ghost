/**
*
* Further info 👉🏼 https://github.com/gatsbyjs/gatsby/blob/master/www/src/hooks/use-active-hash.js
*
*/

import { useEffect, useState } from "react"

export const useActiveHash = (itemIds: string[], rootMargin: string | undefined = undefined) => {
    const [activeHash, setActiveHash] = useState(``)

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveHash(entry.target.id)
                }
            })
        }, { rootMargin: rootMargin || `0% 0% -90% 0%` })

        const trigger = (id: string, key: 'observe' | 'unobserve') => {
            const element = document.getElementById(id)
            element && typeof element === `object` ? observer[key](element) : null
        }

        itemIds.forEach(id => trigger(id, `observe`))

        return () => itemIds.forEach(id => trigger(id, `unobserve`))
    }, [itemIds, rootMargin, setActiveHash])

    return activeHash
}
