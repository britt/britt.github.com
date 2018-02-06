import React from 'react'

export default function Template (props) {
  return (
    <main>
      {JSON.stringify(props)}
    </main>
  )
}

export const query = graphql`
query JSONPageByPath($weekRegex: String!) {
  allDataJson(filter: {id: {regex: $weekRegex}}) {
    edges {
      node {
        id
        title
        week
        articles {
          title
          date_liked
          description
          url
          notes
        }
      }
    }
  }
}
`
