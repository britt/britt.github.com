const keys = require('lodash/keys')
const moment = require('moment')

// load google sheets info from the environment
const googleSheetEmail = process.env.GSHEET_EMAIL
const googleSheetPrivateKey = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCxg8WrPeP2qhjh
a5JBed7NofngXDR8FpSWdYjVAcdtYHWyyPto3tnVsEH6l+VPQnWpARnC5ypdi+ti
tLRvmMtZFQZ25a+0VjLvPd21m1lodhQoMs/H0utC8uUVPjDEl6KJWBQO3c22lNcZ
Q2WpuRPlvNJ27UGMWeqYSdlxlHjOCa+sWYv0DTAUDf06+2ve8NSSgfpUTvrYutlK
qyHg21a2tXI0WLVqd4dNxO04WFFExT5N1kp98yVrOprniJPXXbogFn6X4sfRY2fx
JXuvuhjqVpaDjeTNqd6YB5eOQLGbW9ij97wUc81hVb5myiJzROyVp7ihcFJd9ki+
iiWju/XVAgMBAAECggEAI+DcTPYfYzWR/c2+K9mz/J/mX0CDoyj1M0viMhs/8Y1z
fIU+uz1/jb8oNrwIrvJh0ZzVVh1e5LVpB/Q6G+wn/YNQYSufTbW2acB5VUFm2sQy
4sUSVfL9dfSd9KMzPCjhwxy4QSD3eRWwO/zxSVKNAPwfFcZyXym1Tr5uYpR9rjbU
x6F29K3MQ096OF9PivXz0blHUo7VFKEe8eSBuB0ScOq92SeoauCXXfdtowt7EUPl
rz4/RxHNvKrANWdup+39c2zcRx7BCij2g++BI5/1Hw4Li2XLOpVpb0b3PvRveKXz
fJToaBCWBDMp7uqB4TcWmKhO6n2+08fJ42JVnEDrKQKBgQDZuqdhFCqLxqVX8iYt
wwtOnucMhxW1NxOV6wrcGneJB1OlbvrrDVm4M+HCj37Z34iguOlqDOw3iGXUww8s
d59reWFLwbVVV8DhU5zMnor8pxmp/EnOdnJ/12UO06BNFhpAuH5Ddj9wifK5NY4n
WIu1dtSGjV6ZXqA8VYn2OdicGwKBgQDQt46OeyP8cuhJmiEyn6zN0GjaUthCbwOJ
Wtf6stDpIQnFlV5g6FNgqICR7oUBzE5grlJesizo5AUcuPyXbqap2GjnJ3H55fDm
xGFGhvBmiNRuzOSj9WlPRyPla73WkKuKCHTt/Sf9+KT1xKYlUatrdjPMU+lX3wKa
SIcaryT0zwKBgQCy2VpoqjIQw0pKpcSqzo7ZNDpC1iwEwYs7GOnAx5TtYLFbMYC3
2C2c3DFUqp7exXnr3DkQPjFDpK1RSjGKq3CuzfQYULRtuDneXdptUsaEp5azRWQz
TqTbUsnWlgwVhlRmWaaOL/IItahGbzGoLFoG4+fL5xCQF2S0aud69SVzhQKBgEcg
psZLlMHtbtfWXMXhwIQLKBBu9x/8sRnYCY537dXk2m2pL5aa1f80rUwOGum39GXi
QlPfKIrdWhiluf7pSIbNJ0LPIHpnMCeUeQoN5lMrAioYTTrK4W6Q8dy3UOSUPME3
jJGmGkDkwWK39170bBSdHZ3eYsD9UOe/G7uuQEvlAoGBANUrTa1dWHzF5M51xMJO
WRHBR3wzxm3Fou/FsWQrrvh8ypSbMDUVhoNiJT282zjrLfgHtt2I1dqIEWs1bghg
lf3LNJUxspiMnEfHboglFVd6f53/XrhxruzV3kRaisIoNlPg5QayayPrtVrWQ+Gb
9RPiPj8ySgS4j7kykVvPB01P
-----END PRIVATE KEY-----`

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
    description: 'Britt Crawford is just a guy who lives in Amity with his family.',
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
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://brittcrawford.com`
      }
    },
    feedConfig
  ]
}
