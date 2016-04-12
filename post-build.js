import FS from 'fs'
import Shell from 'child_process'
import Feed from 'feed'
import TOML from 'toml-js'
import PageUtils from './lib/page_utils'
import { Pages } from './lib/sort_utils'
import moment from 'moment'
import frontmatter from 'front-matter'

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

    let feedPages = pages.filter((page) => PageUtils.isDatedPost(page.path))
                      .sort(Pages.dateInPath)
                      .reverse()
                      .slice(0,10)

    for(let feedPage of feedPages) {
      const metaData = {
        date: PageUtils.extractDatePart(feedPage.path)
      }

      const pageData = FS.readFileSync(
        `${__dirname}/pages/${feedPage.requirePath}`,
        'utf-8')

      if(feedPage['file']['ext'] == 'md') {
        metaData.title = frontmatter(pageData).attributes.title
      } else if(feedPage['file']['ext'] == 'json'){
        metaData.title = JSON.parse(pageData)['title']
      }

      feed.addItem({
        title: metaData.title,
        link: `${config.link}${feedPage.path}`,
        content: "<div>CONTENT</div>",
        id: `tag:${config.siteTitle},${metaData.date}:${feedPage.path}`,
        date: moment(metaData.date).toDate()
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
