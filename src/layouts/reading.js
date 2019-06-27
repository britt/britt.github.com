import React from 'react'
import ArticleList from '../components/ArticleList'
import Helmet from 'react-helmet'
import moment from 'moment'

export default function Template ({data, pathContext}) {
  const articles = data.allGoogleSheetSheet1Row.edges
  const week = moment(pathContext.week, 'YYYY-MM-DD')
  return (
    <main className='reading-notes'>
      <Helmet title={`Reading for ${week.format('MMMM Do, YYYY')}`} />
      <header className='subheader'>
        Articles I liked from the week of <strong>{week.format('MMMM Do, YYYY')}</strong>.
      </header>
      <ArticleList articles={articles} />
    </main>
  )
}

export const query = graphql`
query ReadingPageByWeek($week: Date!) {
    allGoogleSheetSheet1Row(filter: {week: {eq: $week}}, sort: {order: ASC, fields: [dateliked]}) {
        totalCount
        edges {
            node {
                title
                dateliked
                description
                url
                week
                notes
            }
        }
    }
}
`
