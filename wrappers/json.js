import React from 'react'
import Headline from 'components/headline'
import ArticleList from 'components/article_list'
import moment from 'moment'

import 'css/gutenberg/src/style/gutenberg.scss'

export default ({route}) => {
  const data = route.page.data
  return (
    <div className="container">
      <Headline>
        Hi, I'm <a className="url fn" href="http://brittcrawford.com" 
          rel="home author" title="my site">
          Britt Crawford
        </a>
      </Headline>
      <main className="reading-notes">
        <header className="subheader">
          Articles I liked from the week of <strong>{data.week}</strong>.
        </header>
        <ArticleList articles={data.articles} />
      </main>
    </div>
  )
}
