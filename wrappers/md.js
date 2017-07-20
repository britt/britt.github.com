import React from 'react'
import DocumentTitle from 'react-document-title'
import {config} from 'config'

module.exports = React.createClass({
  propTypes () {
    return {
      router: React.PropTypes.object
    }
  },
  render () {
    const post = this.props.route.page.data
    return (
      <DocumentTitle title={post.title + ' - ' + config.siteTitle}>
        <main dangerouslySetInnerHTML={{ __html: post.body }} />
      </DocumentTitle>
    )
  }
})
