import React from 'react'
import moment from 'moment'

export default ({article}) => {
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