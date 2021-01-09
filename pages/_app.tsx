import { AppProps } from 'next/app'
import { OverlayProvider } from '@components/contexts/overlayProvider'
import { ThemeProvider } from '@components/contexts/themeProvider'
import { processEnv } from '@lib/processEnv'

import React from 'react'
import Router from 'next/router'
import * as gtag from '@lib/gtag'

import '@styles/screen.css'
import '@styles/screen-fixings.css'
import '@styles/dark-mode.css'
import '@styles/toc.css'

if (process.env.NODE_ENV === 'production') {
  // Notice how we track pageview when route is changed
  Router.events.on('routeChangeComplete', (url) => gtag.pageview(url))
}

function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider {...processEnv.darkMode} >
      <OverlayProvider >
        <Component {...pageProps} />
      </OverlayProvider>
    </ThemeProvider>
  )
}

export default App
