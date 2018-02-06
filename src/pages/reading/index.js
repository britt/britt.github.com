import React from 'react'
import '../../styles/gutenberg.scss'
import { Pages } from '../../lib/sort_utils'
import PageUtils from '../../lib/page_utils'
import Link from 'gatsby-link'

const WeekLink = ({page}) => {
  return (
    <li>
      <Link to={`/reading/${PageUtils.extractDatePart(page.id)}`}>{page.week}</Link>&nbsp;
      &mdash; {page.articles.length} articles
    </li>
  )
}

export default ({data}) => {
  const pages = data.allDataJson.edges.map(e => e.node)
  const links = pages.sort(Pages.dateInPath).reverse().map((page) => <WeekLink page={page} />)

  return (
    <main className='reading-notes'>
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
    allDataJson {
      edges {
        node {
          id
          title
          week
          articles {
              title
          }
        }
      }
    }
  }
`
