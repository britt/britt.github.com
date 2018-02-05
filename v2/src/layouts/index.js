import React from 'react'
import Helmet from 'react-helmet'
import VCard from '../components/VCard'
import Headline from '../components/Headline'
import Footer from '../components/Footer'

import '../styles/gutenberg.scss'

export default ({children}) => {
  return (
    <VCard className='container home-page'>
      <Helmet
        title='brittcrawford.com'
        meta={[
        { name: 'description', content: 'Britt Crawford is just a guy who lives in Salem with his family.' },
        { name: 'author', content: 'Britt Crawford' },
        { name: 'keywords', content: 'programming, data, analysis, food, cocktails, dilettante, adventurer, gentleman' }
        ]}
        link={[
          {rel: 'shortcut icon', href: '/img/favicon.ico'},
          {rel: 'alternate', type: 'application/atom+xml', href: '/feed.xml'},
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
