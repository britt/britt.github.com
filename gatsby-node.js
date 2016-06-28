import FS from 'fs'
import Shell from 'child_process'
import Feed from 'feed'
import TOML from 'toml-js'
import moment from 'moment'
import frontmatter from 'front-matter'
import MarkdownIt from 'markdown-it'
import PageUtils from './lib/page_utils'
import { Pages, Dates } from './lib/sort_utils'
import isSomething from './lib/is_something'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import ArticleList from './components/article_list'

class FeedPage {
  constructor(pageData) {
    this.type = pageData.file.ext
    this.path = pageData.path
    this.date = PageUtils.isDatedPost(pageData.path) ? moment(PageUtils.extractDatePart(pageData.path)) : null

    const page = FS.readFileSync(`${__dirname}/pages/${pageData.requirePath}`,'utf-8')

    if(this.type == 'md') {
      const md = MarkdownIt({
        html: true,
        linkify: true,
        typographer: true
      })
      const fm = frontmatter(page)

      this.title = fm.attributes.title
      this.content = md.render(fm.body)
      if(isSomething(fm.attributes.date))
        this.date = moment(fm.attributes.date)
    } else if(this.type == 'json'){
      const json = JSON.parse(page)

      this.title = json['title']
      this.content = ReactDOMServer.renderToStaticMarkup(<ArticleList articles={json['articles']} />)
    }
  }
}

function thereIsNoTry(callback) {
  return (err, data) => {
    if(err) {
      process.stderr.write(err.toString())
      process.exit(1)
    } else {
      callback(data)
    }
  }
}

function generateFeed(pages) {
  FS.readFile('config.toml', thereIsNoTry((data) => {
    const config = TOML.parse(data)
    const now = moment()
    const feed = new Feed({
      title:       config.siteTitle,
      description: config.description,
      link:        config.link,
      id: `tag:${config.siteTitle},${now.format('YYYY-mm-DD')}:/${now.format('YYYYmmDDX')}`,
      copyright:   `All rights reserved 2016, ${config.author.fullName}`,    
      author: {
        name:    config.author.fullName,
        email:   config.author.email,
        link:    config.link
      }
    })

    feed.addContributor({
      name: config.author.fullName,
      email: config.author.email,
      link: config.link
    })

    const feedPages = pages
      .map((page) => new FeedPage(page))
      .filter((page) => isSomething(page.date))
      .sort((a,b) => Dates.momentSort(a.date, b.date)) 
      .reverse()
      .slice(0,10)

    for(let page of feedPages) {
      feed.addItem({
        title: page.title,
        link: `${config.link}${page.path}`,
        content: page.content,
        id: `tag:${config.siteTitle},${page.date}:${page.path}`,
        date: page.date.toDate()
      })
    }

    FS.writeFileSync(`${__dirname}/public/feed.xml`, feed.render('atom-1.0'))
  }))
}

function postBuild(pages, callback) {
  Shell.execSync("cp -r assets/* public/")
  Shell.execSync("cp -r assets/.nojekyll public/")
  Shell.execSync("cp -r assets/.gitignore public/")
  Shell.execSync("cp -r assets/.well-known public/")
  generateFeed(pages)
  callback()
}

export { postBuild }
