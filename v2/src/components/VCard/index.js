import React from 'react'

export default (props) => {
  return <div className={props.className + ' vcard'}>
    {props.children}
  </div>
}
