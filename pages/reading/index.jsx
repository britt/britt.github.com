import React from 'react'
import Headline from 'components/headline'
import Icon from 'components/icon'
import DocumentTitle from 'react-document-title'
import moment from 'moment'
import 'css/gutenberg/src/style/gutenberg.scss'
import { Pages } from 'lib/sort_utils'
import { config } from 'config'
import PageUtils from 'lib/page_utils'

const WeekLink = ({page}) => {
  return (
    <li>
      <a href={page.path}>{page.data.week}</a>&nbsp;
      &mdash; {page.data.articles.length} articles
    </li>
  )
}

export default ({route}) => {
  const pages = route.pages.filter((page) => PageUtils.isReadingPage(page.path))
  const links = pages.sort(Pages.dateInPath).reverse().map((page) => <WeekLink page={page} />)

  return (
    <DocumentTitle title={"Reading Notes - " + config.siteTitle }>
      <main className="reading-notes">
        <h2>
          Reading Notes
        </h2>
        <p>
          A short description and notes for articles I read and liked. Some of 
          the articles I found insightful, those tend to have notes, others just
          had interesting information or a cool fact. I keep these notes because 
          making myself write down a brief summary fixes the information in my 
          mind.
        </p>
        <ul>
          {links}
        </ul>
      </main>
    </DocumentTitle>
  )
}
