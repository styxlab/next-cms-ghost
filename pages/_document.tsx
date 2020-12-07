
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { Helmet, HelmetData } from 'react-helmet'
import { resolve } from 'url'
import { processEnv } from '@lib/processEnv'

interface Props {
  helmet: HelmetData
}

enum HelmetAttributes {
  base,
  bodyAttributes,
  htmlAttributes,
  link,
  meta,
  noscript,
  script,
  style,
  title,
  titleAttributes
}

export default class MyDocument extends Document<Props> {

  static async getInitialProps(ctx: DocumentContext) {
    const documentProps = await super.getInitialProps(ctx)
    return { ...documentProps, helmet: Helmet.renderStatic() }
  }

  // should render on <body>
  get helmetBodyAttrComponents() {
    return this.props.helmet.bodyAttributes.toComponent()
  }

  render() {
    const { pageProps } = this.props.__NEXT_DATA__.props
    const { cmsData }  = pageProps || { cmsData: null }
    const { settings } = cmsData || { settings: null }
    const { lang } = settings || { lang: 'en' }

    return (
      <Html {...{lang, className: 'casper' }}>
        <Head>
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Jamify RSS Feed"
            href={`${resolve(processEnv.siteUrl, 'rss.xml')}`}
          />
        </Head>
        <body {...this.helmetBodyAttrComponents}>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            (function(){
                window.isDark = localStorage.getItem('dark');
                if ( window.isDark === 'dark' ) {
                  document.body.classList.add('dark')
                } else if( window.isDark === undefined && window.matchMedia('(prefers-color-scheme: dark)').matches === true ){
                  document.body.classList.add('dark')
                }
            })()
          `,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
