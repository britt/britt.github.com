import React from 'react'
import Helmet from 'react-helmet'

export default function Template ({
  data // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { html, frontmatter } = markdownRemark
  return (
    <main>
      <Helmet title={frontmatter.title} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </main>
  )
}

export const pageQuery = graphql`
  query MarkdownPageByPath($path: String!) {
    markdownRemark(frontmatter: { path: { eq: $path } }) {
      html
      frontmatter {
        date(formatString: "MMMM DD, YYYY")
        path
        title
      }
    }
  }
`
