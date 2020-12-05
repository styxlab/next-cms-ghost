import { AppProps } from 'next/app'
import { OverlayProvider } from '@components/contexts/overlayProvider'
import { ThemeProvider } from '@components/contexts/themeProvider'
import { processEnv } from '@lib/processEnv'

import '@styles/screen.css'
import '@styles/screen-fixings.css'
import '@styles/dark-mode.css'
import '@styles/prism.css'
import '@styles/toc.css'

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
