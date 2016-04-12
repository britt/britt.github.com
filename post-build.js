import Shell from 'child_process'
import Feed from 'feed'
import moment from 'moment'
import MarkdownIt from 'markdown-it'
import FrontMatter from 'front-matter'
import FS from 'fs'
import TOML from 'toml-js'

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

function copyAssets() {
  Shell.execSync("cp -r assets/* public/")
  Shell.execSync("cp -r assets/.nojekyll public/")
  Shell.execSync("cp -r assets/.gitignore public/")
  Shell.execSync("cp -r assets/.well-known public/")
}

function addItem(feed, page) {
  feed.addItem({
    title: page.data.title
    link: "http://brittcrawford.com#{page.path}"
    date: moment(page.data.date).toDate()
    content: md.render(
      frontmatter(
        fs.readFileSync(
          "#{__dirname}/pages/#{page.requirePath}",
          'utf-8'
        )
      ).body
    )
    author: [{
      name: "Britt Crawford"
      email: "britt@illtemper.org"
      link: "http://brittcrawford.com"
    }]
  })
}

function generateAtomFeed(pages, configData) {
  const config = TOML.parse(configData)

  md = MarkdownIt({
    html: true
    linkify: true
    typographer: true
  })

  feed = new Feed({
    title:       config.siteTitle,
    description: config.description,
    link:        'http://brittcrawford.com/',
    copyright:   'All rights reserved 2016, Britt Crawford',
    author: {
      name:    'Britt Crawford',
      email:   'britt@illtemper.org',
    }
  })

  feed.addContributor({
    name: 'Britt Crawford'
    email: 'britt@illtemper.org'
    link: 'http://brittcrawford.com'
  })

  const feedPages = pages.filter((page) => {
    const datePart = Page.extractDateFromPath(page.path)
    return datePart != undefined && datePart != null
  })

  feedPages.sort(Pages.byDate).reverse().slice(0,10).map(addItem)
  fs.writeFileSync "#{__dirname}/public/atom.xml", feed.render('atom-1.0')
}

export default (pages, callback) => {
  // FS.readFile('config.toml', thereIsNoTry(generateAtomFeed.bind(this, pages)))
  copyAssets()
}
