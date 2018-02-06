import React from 'react'
import ArticleList from '../components/ArticleList'

export default function Template ({data}) {
  const week = data.allDataJson.edges[0].node
  return (
    <main className='reading-notes'>
      <header className='subheader'>
        Articles I liked from the week of <strong>{week.week}</strong>.
      </header>
      <ArticleList articles={week.articles} />
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
