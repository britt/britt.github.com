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
        { name: 'description', content: 'Sample' },
        { name: 'keywords', content: 'sample, something' }
        ]}
    />
      <Headline />
      {children()}
      <Footer />
    </VCard>
  )
}
