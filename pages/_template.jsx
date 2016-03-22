import React from 'react'
import { Link } from 'react-router'
import { link } from 'gatsby-helpers'
import Headroom from 'react-headroom'

module.exports = ({children}) => {
  return (
    <div>
      <Headroom
        wrapperStyle={{
          marginBottom: rhythm(1),
        }}
        style={{
          background: 'lightgray',
        }}
      >
        <Container
          style={{
            maxWidth: 960,
            paddingTop: 0,
            padding: `${rhythm(1)} ${rhythm(1/2)}`,
          }}
        >
          <Link
            to={link('/')}
            style={{
              color: 'black',
              textDecoration: 'none',
            }}
          >
            Gatsby!!!
          </Link>
        </Container>
      </Headroom>
      <Container
        style={{
          maxWidth: 960,
          padding: `${rhythm(1)} ${rhythm(1/2)}`,
          paddingTop: 0,
        }}
      >
        {children}
      </Container>
    </div>
  )
}