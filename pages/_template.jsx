import React from 'react'
import VCard from 'components/vcard'
import Headline from 'components/headline'
import Footer from 'components/footer'

module.exports = ({children}) => {
  return (
    <VCard className='container home-page'>
      <Headline />
      {children}
      <Footer />
    </VCard>
  )
}
