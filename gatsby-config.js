
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

const googleSheetEmail = process.env.GSHEET_EMAIL
const googleSheetPrivateKey = process.env.GSHEET_PRIVATE_KEY

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
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages/reading/data/`,
        name: 'reading-pages'
      }
    },
    `gatsby-transformer-remark`,
    `gatsby-transformer-json`,
    `gatsby-plugin-netlify`,
    {
      resolve: 'gatsby-source-google-sheets',
      options: {
        spreadsheetId: '1dFrxOeknJy1nfS85eVhWROR3U9nFF3Zl8qOiOqHxfBY',
        worksheetTitle: 'Sheet1',
        credentials: {
          client_email: googleSheetEmail,
          private_key: googleSheetPrivateKey
        }
      }
    },
    {
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
            serialize: ({ query: { site, allFile } }) => {
              return allFile.edges.map(edge => {
                if (edge.node.childMarkdownRemark) {
                  const data = edge.node.childMarkdownRemark
                  return Object.assign({}, data.frontmatter, {
                    description: data.excerpt || data.frontmatter.title,
                    url: site.siteMetadata.siteUrl + data.frontmatter.path,
                    guid: site.siteMetadata.siteUrl + data.frontmatter.path,
                    custom_elements: [{ 'content:encoded': data.html }]
                  })
                }

                if (edge.node.childDataJson) {
                  const data = edge.node.childDataJson
                  const path = `/reading/${edge.node.relativePath.replace('.json', '').replace('reading-', '')}`
                  return Object.assign({}, {
                    title: data.title,
                    description: `Articles I liked or found interesting during the week of ${data.week}.`,
                    url: site.siteMetadata.siteUrl + path,
                    guid: site.siteMetadata.siteUrl + path,
                    custom_elements: [{ 'content:encoded': readingSummary(data) }]
                  })
                }
              })
            },
            query: `
              {
                allFile(
                  limit: 1000,
                  sort: {order: DESC, fields: changeTime}
                ) {
                  edges {
                    node {
                      relativePath
                      changeTime
                      childMarkdownRemark {
                        id
                        frontmatter {
                          title
                        }
                        html
                      }
                      childDataJson {
                        id
                        title
                        week
                        articles {
                          title
                          date_liked
                          description
                          url
                          notes
                        }
                      }
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
  ]
}
