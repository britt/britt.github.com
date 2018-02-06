import React from 'react'

const MyNotes = ({notes}) => {
  return <section className='my-notes'>
    {notes}
  </section>
}

export default ({article}) => {
  const renderIf = (test, component) => {
    return test ? component : null
  }

  return (
    <li>
      <article className='reading-note'>
        <a href={article.url} className='title' target='_blank'>
          {article.title}
        </a>
        <summary className='description'>
          {article.description}
        </summary>
        {renderIf(article.notes, <MyNotes notes={article.notes} />)}
      </article>
    </li>
  )
}
