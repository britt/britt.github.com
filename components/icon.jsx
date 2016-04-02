import React from 'react'
import 'css/font-awesome.scss'

export default ({name}) => {
  return <i className={"fa fa-" + name + " fa-fw"} />
}