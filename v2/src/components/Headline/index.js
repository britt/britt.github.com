import React from 'react'
import Link from 'gatsby-link'

export default ({className, children}) => {
  const cssClass = className === undefined ? '' : className

  return <header className={'headline ' + cssClass}>
    <h1>
      Hi, I'm <Link className='url fn' to='/' rel='home author' title='my site'>
        Britt Crawford
      </Link>
    </h1>
  </header>
}
