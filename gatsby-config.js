const keys = require('lodash/keys')
const moment = require('moment')

// load google sheets info from the environment
const googleSheetEmail = process.env.GSHEET_EMAIL
const googleSheetPrivateKey = process.env.GSHEET_PRIVATE_KEY
const spreadsheetId = process.env.GSHEET_ID
const worksheetTitle = process.env.GSHEET_WORKSHEET

function articleSummary (article) {
  return `
    <li>
      <a href="${article.url}">${article.title}</a>
      <p>
        ${article.description}
      </p>
      ${
        article.notes ? `<p><h4>Notes</h4>${article.notes}</p>` : ''
      }
    </li>`
}

function readingSummary (data) {
  return `
  <ol>
    ${data.articles.map(a => articleSummary(a)).join('\n')}
  </ol>
  `
}

function momentSort (firstDate, secondDate) {
  if (firstDate.isAfter(secondDate)) {
    return 1
  } else if (firstDate.isBefore(secondDate)) {
    return -1
  } else {
    return 0
  }
}

function buildFeed ({ query: { site, allFile, allGoogleSheetSheet1Row } }) {
  let entries = allFile.edges.map(edge => {
    if (edge.node.childMarkdownRemark) {
      const data = edge.node.childMarkdownRemark
      return Object.assign({}, data.frontmatter, {
        description: data.excerpt || data.frontmatter.title,
        url: site.siteMetadata.siteUrl + data.frontmatter.path,
        guid: site.siteMetadata.siteUrl + data.frontmatter.path,
        custom_elements: [{ 'content:encoded': data.html }]
      })
    }
  })

  let byWeek = allGoogleSheetSheet1Row.edges.reduce((acc, e) => {
    if (!acc[e.week]) {
      acc[e.week] = [e]
    } else {
      acc[e.week].unshift(e)
    }
    return acc
  }, {})

  keys(byWeek).forEach(k => {
    let data = byWeek[k]
    let week = moment(data[0].week, 'YYYY-MM-DD')
    let url = site.siteMetadata.siteUrl + `/reading/${data[0].week}`
    let entry = Object.assign({}, {
      title: `Reading for ${week.format('MMMM Do, YYYY')}`,
      date: data[data.length - 1].dateliked,
      description: `Articles I liked from the week of ${week.format('MMMM Do, YYYY')}.`,
      url: url,
      guid: url,
      custom_elements: [{ 'content:encoded': readingSummary(data) }]
    })

    entries.push(entry)
  })

  return entries.sort((a, b) => momentSort(moment(b.date), moment(a.date)))
}

const feedConfig = {
  resolve: 'gatsby-plugin-feed',
  options: {
    query: `
        {
          site {
            siteMetadata {
              title
              description
              siteUrl
              site_url: siteUrl
            }
          }
        }
      `,
    feeds: [
      {
        serialize: buildFeed,
        query: `
        {
          allFile(limit: 1000, sort: {order: DESC, fields: [changeTime]}) {
            edges {
              node {
                relativePath
                changeTime
                childMarkdownRemark {
                  frontmatter {
                    title
                    date
                  }
                  html
                }
                internal {
                  mediaType
                }
              }
            }
          }
          allGoogleSheetSheet1Row(limit:1000, sort:{order: DESC, fields: [week]}) {
            edges {
              node {
                title
                week
                url
                dateliked
                description
                notes
              }
            }
          }
        }
          `,
        output: '/rss.xml'
      }
    ]
  }
}

module.exports = {
  siteMetadata: {
    title: 'brittcrawford.com',
    description: 'Britt Crawford is just a guy who lives in Salem with his family.',
    siteUrl: 'https://brittcrawford.com',
    author: 'Britt Crawford',
    keywords: 'programming, data, analysis, food, cocktails, dilettante, adventurer, gentleman'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages/cocktails/`,
        name: 'markdown-pages'
      }
    },
    `gatsby-transformer-remark`,
    `gatsby-plugin-netlify`,
    {
      resolve: 'gatsby-source-google-sheets',
      options: {
        spreadsheetId: spreadsheetId,
        worksheetTitle: worksheetTitle,
        credentials: {
          client_email: googleSheetEmail,
          private_key: googleSheetPrivateKey
        }
      }
    },
    feedConfig
  ]
}
