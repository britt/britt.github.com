import React from 'react'

export default ({className, children}) => {
  const cssClass = className === undefined ? '' : className

  return <header className={"headline " + cssClass}>
    <h1>{children}</h1>
  </header>
}