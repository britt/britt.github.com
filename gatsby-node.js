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
        createPage({
          path: node.frontmatter.path,
          component: markdownPageTemplate,
          context: {
            week: ''
          }
        })
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
      result.data.allGoogleSheetSheet1Row.edges.forEach(({ node }) => {
        let week = moment(node.dateliked, 'MMMM DD, YYYY at hh:mmA').startOf('week')
        if (!node.fieldOwners) {
          node.fieldOwners = []
        }

        if (!currentWeek || !currentWeek.isSame(week)) {
          createPage({
            path: `/reading/${week.format('YYYY-MM-DD')}/`,
            component: readingPageTemplate,
            context: {
              week: `${week.format('YYYY-MM-DD')}`
            } // additional data can be passed via context
          })
          currentWeek = week
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
