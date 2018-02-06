import React from 'react'
import Helmet from 'react-helmet'
import VCard from '../components/VCard'
import Headline from '../components/Headline'
import Footer from '../components/Footer'

import '../styles/gutenberg.scss'

export default ({data, children}) => {
  const meta = data.site.siteMetadata
  return (
    <VCard className='container home-page'>
      <Helmet
        title={meta.title}
        meta={[
        { name: 'description', content: meta.description },
        { name: 'author', content: meta.author },
        { name: 'keywords', content: meta.keywords }
        ]}
        link={[
          {rel: 'shortcut icon', href: '/img/favicon.ico'},
          {rel: 'alternate', type: 'application/rss+xml', href: '/rss.xml'},
          {rel: 'apple-touch-icon', href: '/assets/img/apple-touch-icon-57-precomposed.png'},
          {rel: 'apple-touch-icon', sizes: '72x72', href: '/assets/img/apple-touch-icon-72-precomposed.png'},
          {rel: 'apple-touch-icon', sizes: '114x114', href: '/assets/img/apple-touch-icon-114-precomposed.png'},
          {rel: 'apple-touch-icon', sizes: '144x144', href: '/assets/img/apple-touch-icon-144-precomposed.png'}
        ]}
    />
      <Headline />
      {children()}
      <Footer />
    </VCard>
  )
}

export const query = graphql`
query siteData {
  site {
    siteMetadata {
      title
      description
      author
      keywords
    }
  }
}
`
