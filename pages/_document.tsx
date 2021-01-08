import { Fragment } from 'react'
import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { resolve } from 'url'
import { processEnv } from '@lib/processEnv'
import { MailchimpPopup } from '@components/MailchimpPopup'
import { GA_TRACKING_ID } from '@lib/gtag'
import { AdWords } from '@components/AdWords'

export default class MyDocument extends Document {

  static async getInitialProps(ctx: DocumentContext) {
    return await super.getInitialProps(ctx)
  }

  render() {
    const isProduction = process.env.NODE_ENV === 'production'
    const { pageProps } = this.props.__NEXT_DATA__.props
    const { cmsData, settings } = pageProps || { cmsData: null, settings: null }
    const { settings: cmsSettings, bodyClass } = cmsData || { settings: null, bodyClass: '' }
    const { lang } = settings || cmsSettings || { lang: 'en' }

    return (
      <Html {...{ lang, className: 'casper' }}>
        <Head>
          <link
            rel="alternate"
            type="application/rss+xml"
            title="Miguel's Blog RSS Feed"
            href={`${resolve(processEnv.siteUrl, 'rss.xml')}`}
          />
         {/* We only want to add the scripts if in production */}
         {isProduction && (
            <Fragment>
              {/* Global Site Tag (gtag.js) - Google Analytics */}
              <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              />
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', '${GA_TRACKING_ID}', {
                      page_path: window.location.pathname,
                    });
                  `,
                }}
              />
            </Fragment>
          )}
        </Head>
        <body {...{ className: bodyClass }}>
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
        <MailchimpPopup />
        <AdWords />
      </Html>
    )
  }
}
