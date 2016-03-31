import React from 'react'
import Headline from 'components/headline'
import 'css/base.scss'
import moment from 'moment'

// TODO
// [x] Fix start of Week fetching
// [] Notes Editor
// [] Command line args for fetch

const Article = ({article}) => {
  const dateLiked = moment(article['date_liked'], "MMMM DD, YYYY at hh:mmA")

  return (
    <li>
      <article className="reading-note">
        <a href={article.url} className="title">
          {article.title}
        </a>
        <summary>
          {article.description}
        </summary>
      </article>
    </li>
  )
}

const ArticleList = ({articles}) => {
  const notesByDay = articles.reduce((acc, article) => {
    const dateLiked = moment(article['date_liked'], "MMMM DD, YYYY at hh:mmA").format('YYYY-MM-DD')

    if(Object.keys(acc).includes(dateLiked)) {
      acc[dateLiked].push(<Article article={article} />)
    } else {
      acc[dateLiked] = [<Article article={article} />]
    }

    return acc
  }, {})

  const notes = Object.keys(notesByDay).reduce((acc, day) => {
    const dateLiked = moment(day, "YYYY-MM-DD")

    acc.push(
      <li>
        <h3>
          <time dateTime={ dateLiked.format('YYYY-MM-DD') } className="date-read">
            { dateLiked.format('dddd MMMM Do') }
          </time>
        </h3>        
        <ol className="reading-notes-list">
          {notesByDay[day]}
        </ol>
      </li>
    )

    return acc
  }, [])

  return (
    <ol className="notes-by-day">
      {notes}
    </ol>
  )
}

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
        <h2 className="subhead">{data.title}</h2>
        <ArticleList articles={data.articles} />
      </main>
    </div>
  )
}
