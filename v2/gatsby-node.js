/**
* Implement Gatsby's Node APIs in this file.
*
* See: https://www.gatsbyjs.org/docs/node-apis/
*/

// You can delete this file if you're not using it

const path = require('path')

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
          context: {} // additional data can be passed via context
        })
      })

      resolve()
    })
  })
}

const datedPathFormat = /(\d{4}-\d{2}-\d{2})/

function createJSONPages (createPage, graphql) {
  return new Promise((resolve, reject) => {
    const jsonPageTemplate = path.resolve(`src/layouts/json.js`)

    return graphql(`
      {
        allDataJson{
          edges {
            node {
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
    `).then(result => {
      if (result.errors) {
        return reject(result.errors)
      }

      result.data.allDataJson.edges.forEach(({ node }) => {
        const week = node.id.match(datedPathFormat)[1]
        createPage({
          path: `/reading/${week}/`,
          component: jsonPageTemplate,
          context: {
            weekRegex: `/${week}/`
          } // additional data can be passed via context
        })
      })

      resolve()
    })
  })
}

exports.createPages = ({ boundActionCreators, graphql }) => {
  const {createPage} = boundActionCreators
  return createMarkdownPages(createPage, graphql).then(result => createJSONPages(createPage, graphql))
}
