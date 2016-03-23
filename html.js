import React from 'react'
import { link } from 'gatsby-helpers'
import GoolgleAnalytics from 'react-g-analytics'
module.exports = ({config, page, body}) => {
  const title = page ? page.title : config.siteTitle
  const favicon = config.favicon

  let cssLink
  if (process.env.NODE_ENV === 'production') {
    cssLink = <link rel="stylesheet" href={link('/styles.css')} />
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport"
          content="width=device-width, initial-scale=1.0 maximum-scale=1.0" />
        <title>{title}</title>

        <meta name="description" content="Britt Crawford is just a guy who lives in San Francisco with his family." />
        <meta name="keywords" content="programming, data, analysis, food, cocktails, dilettante, adventurer, gentleman" />
        <meta name="author" content="Britt Crawford" />

        <link rel="shortcut icon" href={favicon} />
        <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon-57-precomposed.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/assets/img/apple-touch-icon-72-precomposed.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/assets/img/apple-touch-icon-114-precomposed.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/assets/img/apple-touch-icon-144-precomposed.png" />
        {cssLink}
      </head>
      <body>
        <div id="react-mount" dangerouslySetInnerHTML={{ __html: body }} />
        <script src={link('/bundle.js')} />
        <script src="/js/flexibility.js" type="text/javascript" />
        <GoolgleAnalytics id="UA-39393464-1" />
      </body>
    </html>
  )
}

