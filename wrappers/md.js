import React from 'react'
import DocumentTitle from 'react-document-title'

module.exports = React.createClass({
  propTypes () {
    return {
      router: React.PropTypes.object,
    }
  },
  render () {
    const post = this.props.route.page.data
    return (
      <DocumentTitle title={post.title}>
        <main dangerouslySetInnerHTML={{ __html: post.body }} />
      </DocumentTitle>
    )
  },
})
