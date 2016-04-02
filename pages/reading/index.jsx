import React from 'react'
import Headline from 'components/headline'
import Icon from 'components/icon'
import DocumentTitle from 'react-document-title'
import moment from 'moment'
import 'css/gutenberg/src/style/gutenberg.scss'

const pathFormat = /\/reading\/(\d{4}-\d{2}-\d{2})\//

function extractDatePart(path) {
  return path.match(pathFormat)[1]
}

function dateSort(firstPage, secondPage) {
  const firstDate = moment(extractDatePart(firstPage.path), "YYYY-MM-DD")
  const secondDate = moment(extractDatePart(secondPage.path), "YYYY-MM-DD")

  if(firstDate.isAfter(secondDate)) {
    return -1
  } else if(firstDate.isBefore(secondDate)) {
    return 1
  } else {
    return 0
  }
}

const WeekLink = ({page}) => {
  return (
    <li>
      <a href={page.path}>{page.data.week}</a>&nbsp;
      &mdash; {page.data.articles.length} articles
    </li>
  )
}

export default ({route}) => {
  const pages = route.pages.filter((page) => page.path.match(pathFormat))
  const links = pages.sort(dateSort).map((page) => <WeekLink page={page} />)

  console.log(pages.sort(dateSort))

  return (
    <DocumentTitle title="Reading Notes">
      <main className="reading-notes">
        <header className="subheader">
          A short description and notes for articles I read and liked.
        </header>
        <h2>
          Reading Notes
        </h2>

        <ul>
          {links}
        </ul>
      </main>
    </DocumentTitle>
  )
}
