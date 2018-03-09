/**
* Implement Gatsby's Node APIs in this file.
*
* See: https://www.gatsbyjs.org/docs/node-apis/
*/

// You can delete this file if you're not using it

const path = require('path')
const moment = require('moment')

function createMarkdownPages (createPage, graphql) {
  return new Promise((resolve, reject) => {
    const markdownPageTemplate = path.resolve(`src/layouts/markdown.js`)

    return graphql(`
      {
        allMarkdownRemark(
          sort: { order: DESC, fields: [frontmatter___date] }
          limit: 1000
        ) {
          edges {
            node {
              frontmatter {
                path
              }
            }
          }
        }
      }
    `).then(result => {
      if (result.errors) {
        return reject(result.errors)
      }

      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        if (!node.frontmatter.draft) {
          createPage({
            path: node.frontmatter.path,
            component: markdownPageTemplate,
            context: {
              week: ''
            }
          })
        }
      })

      resolve()
    })
  })
}

function createReadingPages (createPage, createParentChildLink, graphql) {
  return new Promise((resolve, reject) => {
    const readingPageTemplate = path.resolve(`src/layouts/reading.js`)

    return graphql(`
    {
      allGoogleSheetSheet1Row {
        totalCount
        edges {
          node {
            title
            dateliked
            description
            url
            notes
            week
          }
        }
      }
    }
    `).then(result => {
      if (result.errors) {
        return reject(result.errors)
      }

      let currentWeek = null
      let lastUpdate = null
      result.data.allGoogleSheetSheet1Row.edges.forEach(({ node }) => {
        let likedAt = moment(node.dateliked, 'MMMM DD, YYYY at hh:mmA')
        let week = likedAt.clone().startOf('week')
        if (!node.fieldOwners) {
          node.fieldOwners = []
        }

        if (!currentWeek) {
          currentWeek = week
        }

        if (!currentWeek.isSame(week)) {
          createPage({
            path: `/reading/${week.format('YYYY-MM-DD')}/`,
            component: readingPageTemplate,
            context: {
              week: `${week.format('YYYY-MM-DD')}`,
              lastUpdated: `${lastUpdate.format()}`
            }
          })
        }

        if (currentWeek && (!lastUpdate || lastUpdate.isBefore(likedAt))) {
          lastUpdate = likedAt
        }
      })

      resolve()
    })
  })
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const {createPage, createParentChildLink} = boundActionCreators
  return createMarkdownPages(createPage, graphql).then(result => createReadingPages(createPage, createParentChildLink, graphql))
}
