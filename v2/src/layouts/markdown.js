import React from 'react'

export default function Template ({
  data // this prop will be injected by the GraphQL query below.
}) {
  const { markdownRemark } = data // data.markdownRemark holds our post data
  const { html } = markdownRemark
  return (
    <main dangerouslySetInnerHTML={{ __html: html }} />
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
