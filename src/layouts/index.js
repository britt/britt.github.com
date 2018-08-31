import React from 'react'
import Helmet from 'react-helmet'
import VCard from '../components/VCard'
import Headline from '../components/Headline'
import Footer from '../components/Footer'

import favicon from './icons/favicon.ico'
import touchIcon from './icons/apple-touch-icon-57-precomposed.png'
import touchIcon72 from './icons/apple-touch-icon-72-precomposed.png'
import touchIcon114 from './icons/apple-touch-icon-114-precomposed.png'
import touchIcon144 from './icons/apple-touch-icon-144-precomposed.png'
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
          {rel: 'stylesheet', href: 'https://use.fontawesome.com/releases/v5.3.1/css/all.css', crossorigin: 'anonymous'},
          {rel: 'shortcut icon', href: favicon},
          {rel: 'alternate', type: 'application/rss+xml', href: '/rss.xml'},
          {rel: 'apple-touch-icon', href: touchIcon},
          {rel: 'apple-touch-icon', sizes: '72x72', href: touchIcon72},
          {rel: 'apple-touch-icon', sizes: '114x114', href: touchIcon114},
          {rel: 'apple-touch-icon', sizes: '144x144', href: touchIcon144}
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
