import React from 'react'

export default (props) => {
  return <article className={"container " + props.className}>
    {props.children}
  </article>
}