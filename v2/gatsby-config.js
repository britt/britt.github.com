module.exports = {
  siteMetadata: {
    title: 'brittcrawford.com'
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    'gatsby-plugin-sass',
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/src/pages/markdown/`,
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
    `gatsby-transformer-json`
  ]
}
