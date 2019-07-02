import React from 'react'
import '../../styles/gutenberg.scss'
import { Dates } from '../../lib/sort_utils'
import Link from 'gatsby-link'
import Helmet from 'react-helmet'
import groupBy from 'lodash/groupBy'
import keys from 'lodash/keys'
import moment from 'moment'

const WeekLink = ({week, count}) => {
  return (
    <li>
      <Link to={`/reading/${week.format('YYYY-MM-DD')}`}>{week.format('MMMM Do, YYYY')}</Link>&nbsp;
      &mdash; {count} articles
    </li>
  )
}

export default ({data}) => {
  const pages = groupBy(data.allGoogleSheetSheet1Row.edges.map(e => e.node), a => moment(a.week, 'YYYY-MM-DD'))
  const weeks = keys(pages)
  const links = weeks.sort((a, b) => Dates.momentSort(moment(b), moment(a))).map(week => {
    return <WeekLink week={moment(week)} count={!pages[week] ? 0 : pages[week].length} />
  })
  return (
    <main className='reading-notes'>
      <Helmet title='What am I reading?' />
      <h2>
          What am I reading?
      </h2>
      <p>
          A short description of articles I have read and liked each week. Some of
          the articles I found insightful, those might have notes, others just
          had interesting information, or a cool fact.
      </p>
      <ul>
        {links}
      </ul>
    </main>
  )
}

export const query = graphql`
query ReadingPages {
  allGoogleSheetSheet1Row(sort: {order: DESC, fields: [week]}) {
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
