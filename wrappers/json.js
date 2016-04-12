import React from 'react'
import Headline from 'components/headline'
import ArticleList from 'components/article_list'
import moment from 'moment'
import DocumentTitle from 'react-document-title'
import 'css/gutenberg/src/style/gutenberg.scss'
import {config} from 'config'

export default ({route}) => {
  const data = route.page.data
  
  return (
    <DocumentTitle title={data.title+ " - " + config.siteTitle}>
      <main className="reading-notes">
        <header className="subheader">
          Articles I liked from the week of <strong>{data.week}</strong>.
        </header>
        <ArticleList articles={data.articles} />
      </main>
    </DocumentTitle>
  )
}
