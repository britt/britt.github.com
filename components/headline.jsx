import React from 'react'

export default ({className, children}) => {
  const cssClass = className === undefined ? '' : className

  return <header className={"headline " + cssClass}>
    <h1>
      Hi, I'm <a className="url fn" href="/" rel="home author" title="my site">
        Britt Crawford
      </a>
    </h1>
  </header>
}