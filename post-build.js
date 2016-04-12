process.env.NODE_PATH = __dirname 

import FS from 'fs'
import Shell from 'child_process'
import Feed from 'feed'
import TOML from 'toml-js'
import moment from 'moment'
import frontmatter from 'front-matter'
import MarkdownIt from 'markdown-it'
import PageUtils from './lib/page_utils'
import { Pages } from './lib/sort_utils'
import React from 'react'
import ReactDOMServer from 'react-dom/server'
import ArticleList from './components/article_list'

class Page {
  constructor(pageData) {
    this.type = pageData.file.ext
    this.date = PageUtils.extractDatePart(pageData.path)
    this.path = pageData.path

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
    } else {
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

    const feedPages = pages.filter((page) => PageUtils.isDatedPost(page.path))
                      .sort(Pages.dateInPath)
                      .reverse()
                      .slice(0,10)

    for(let feedPage of feedPages) {
      const page = new Page(feedPage)

      feed.addItem({
        title: page.title,
        link: `${config.link}${page.path}`,
        content: page.content,
        id: `tag:${config.siteTitle},${page.date}:${page.path}`,
        date: moment(page.date).toDate()
      })
    }

    FS.writeFileSync(`${__dirname}/public/feed.xml`, feed.render('atom-1.0'))
  }))
}

export default (pages, callback) => {
  Shell.execSync("cp -r assets/* public/")
  Shell.execSync("cp -r assets/.nojekyll public/")
  Shell.execSync("cp -r assets/.gitignore public/")
  Shell.execSync("cp -r assets/.well-known public/")
  generateFeed(pages)
  callback()
}
