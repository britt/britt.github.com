import React from 'react'
import { prefixLink } from 'gatsby-helpers'
import GoogleAnalytics from 'components/google_analytics'
import DocumentTitle from 'react-document-title'
import { config } from 'config'

export default (route) => {
  const favicon = config.favicon
  const title = DocumentTitle.rewind()

  let cssLink
  if (process.env.NODE_ENV === 'production') {
    cssLink = <link rel='stylesheet' href={prefixLink('/styles.css')} />
  }

  return (
    <DocumentTitle title={config.siteTitle}>
      <html lang='en'>
        <head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
          <meta name='viewport'
            content='width=device-width, initial-scale=1.0 maximum-scale=1.0' />
          <title>{ config.siteTitle }</title>

          <meta name='description' content='Britt Crawford is just a guy who lives in San Francisco with his family.' />
          <meta name='keywords' content='programming, data, analysis, food, cocktails, dilettante, adventurer, gentleman' />
          <meta name='author' content='Britt Crawford' />

          <link rel='shortcut icon' href={favicon} />
          <link rel='apple-touch-icon' href='/assets/img/apple-touch-icon-57-precomposed.png' />
          <link rel='apple-touch-icon' sizes='72x72' href='/assets/img/apple-touch-icon-72-precomposed.png' />
          <link rel='apple-touch-icon' sizes='114x114' href='/assets/img/apple-touch-icon-114-precomposed.png' />
          <link rel='apple-touch-icon' sizes='144x144' href='/assets/img/apple-touch-icon-144-precomposed.png' />
          <link rel='alternate' type='application/atom+xml' href={config.link + 'feed.xml'} />
          {cssLink}
        </head>
        <body>
          <button id='btnToggleGrid' style={{display: 'none'}}>show grid</button>
          <div id='react-mount' dangerouslySetInnerHTML={{ __html: route.body }} />
          <script src={prefixLink('/bundle.js')} />
          <GoogleAnalytics id='UA-39393464-1' />
        </body>
      </html>
    </DocumentTitle>
  )
}
