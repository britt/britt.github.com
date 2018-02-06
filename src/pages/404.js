import React from 'react'
import whoa from './whoa.gif'

const NotFoundPage = () => (
  <div>
    <h2>404 NOT FOUND</h2>
    <p>
      The place you've gone doesn't exist...
      <img src={whoa} class='raised' alt='Whoa!' />
    </p>
  </div>
)

export default NotFoundPage
