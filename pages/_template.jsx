import React from 'react' 
import Footer from './_footer'

module.exports = ({children}) => {
  return (
    <div className="home-page">
      {children}
      <Footer />
    </div>
  )
}