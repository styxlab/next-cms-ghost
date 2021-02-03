import { useEffect } from 'react'

/**
 *
 * Credits to 👉 https://nehalist.io/adding-commento-to-react-apps-like-gatsby/#commento-login-box-container
 *
 */

// Helper to add scripts to our page
const insertScript = (src: string, id: string, parentElement: HTMLElement) => {
  const script = window.document.createElement(`script`)
  script.async = true
  script.src = src
  script.id = id
  parentElement.appendChild(script)
  return script
}

// Helper to remove scripts from our page
const removeScript = (id: string, parentElement: HTMLElement) => {
  const script = window.document.getElementById(id)
  if (script) {
    parentElement.removeChild(script)
  }
}

interface CommentoEmbedProps {
  id: string
  url: string
}

export const CommentoEmbed = ({ id, url }: CommentoEmbedProps) => {
  useEffect(() => {
    if (!url) return

    if (window.document.getElementById(`commento`)) {
      //url: <your comment url>
      insertScript(`${url}/js/commento.js`, `commento-script`, document.body)
    }
    return () => removeScript(`commento-script`, document.body)
  }, [id, url])

  return <div id={`commento`} />
}
