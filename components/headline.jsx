import React from 'react'

export default (props) => {
  return <div className={"headline " + props.className}>
    {props.children}
  </div>
}