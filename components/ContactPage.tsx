import Image from 'next/image'

import DefaultErrorPage from 'next/error'
import Head from 'next/head'

import { HeaderPage } from '@components/HeaderPage'
import { Layout } from '@components/Layout'
import { PostCard } from '@components/PostCard'

import { ServiceConfig, ContactForm } from '@components/contact/ContactForm'
import { PostClass } from '@helpers/PostClass'
import { SEO } from '@meta/seo'

import { GhostPostOrPage, GhostPostsOrPages, GhostSettings } from '@lib/ghost'
import { ISeoImage } from '@meta/seoImage'

interface ContactPage extends GhostPostOrPage {
  form_topics: string[]
  serviceConfig: ServiceConfig
}

interface PageProps {
  cmsData: {
    page: ContactPage
    previewPosts?: GhostPostsOrPages
    settings: GhostSettings
    seoImage: ISeoImage
    bodyClass: string
  }
}

export function Contact({ cmsData }: PageProps) {
  const { page, previewPosts, settings, seoImage, bodyClass } = cmsData
  const { meta_title, meta_description } = page

  const { processEnv } = settings
  const { nextImages, contactPage } = processEnv

  if (!contactPage) {
    return (
      <>
        <Head>
          <meta name="robots" content="noindex" />
        </Head>
        <DefaultErrorPage statusCode={404} />
      </>
    )
  }

  const featImg = page.featureImage
  const postClass = PostClass({ tags: page.tags, isPage: page && true, isImage: !!featImg })
  //const htmlAst = page.htmlAst
  //if (htmlAst === undefined) throw Error('Page.tsx: htmlAst must be defined.')

  return (
    <>
      <SEO {...{ settings, meta_title, meta_description, seoImage }} />
      <Layout {...{ settings, bodyClass }} header={<HeaderPage {...{ settings }} />}>
        <div className="inner">
          <article className={`post-full ${postClass}`}>

            <header className="post-full-header">
              <h1 className="post-full-title">{page.title}</h1>

              {page.custom_excerpt &&
                <p className="post-full-custom-excerpt">{page.custom_excerpt}</p>
              }
            </header>

            {featImg && (
              nextImages.feature && featImg.dimensions ? (
                <figure className="post-full-image" style={{ display: 'inherit' }}>
                  <Image
                    src={featImg.url}
                    alt={page.title}
                    quality={nextImages.quality}
                    layout="responsive"
                    sizes={`
                              (max-width: 350px) 350px,
                              (max-width: 530px) 530px,
                              (max-width: 710px) 710px,
                              (max-width: 1170px) 1170px,
                              (max-width: 2110px) 2110px, 2000px
                            `}
                    {...featImg.dimensions}
                  />
                </figure>
              ) : (page.feature_image && (
                <figure className="post-full-image">
                  <img src={page.feature_image} alt={page.title} />
                </figure>
              ))
            )}

            <section className="post-full-content">

              <div className="post-content">
                <ContactForm topics={page.form_topics} serviceConfig={page.serviceConfig} />
              </div>

              <div className="post-content" dangerouslySetInnerHTML={{ __html: page.html || '' }}>
                {/* <RenderContent htmlAst={htmlAst} /> */}
              </div>

            </section>
          </article>

          <div className="post-feed">
            {previewPosts?.map((post, i) => (
              <PostCard key={post.id} {...{settings, post, num: i}} />
            ))}
          </div>

        </div>
      </Layout>
    </>
  )
}
