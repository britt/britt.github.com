import React from 'react'
import Headline from 'components/headline'
import moment from 'moment'
import 'css/gutenberg/src/style/gutenberg.scss'

const Article = ({article}) => {
  const dateLiked = moment(article['date_liked'], "MMMM DD, YYYY at hh:mmA")

  return (
    <li>
      <article className="reading-note">
        <a href={article.url} className="title">
          {article.title} 
        </a> 
        <summary className="description">
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
      <section>
        <h3>
          <time dateTime={ dateLiked.format('YYYY-MM-DD') } className="date-read">
            { dateLiked.format('dddd') }
          </time>
        </h3>        
        <ol className="reading-notes-list">
          { notesByDay[day] }
        </ol>
      </section>
    )

    return acc
  }, [])

  return (
    <div className="notes-by-day">
      {notes}
    </div>
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
        <header className="subheader">
          Articles I liked from the week of <strong>{data.week}</strong>.
        </header>
        <ArticleList articles={data.articles} />
      </main>
    </div>
  )
}
