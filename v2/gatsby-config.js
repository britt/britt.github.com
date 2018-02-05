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
    `gatsby-transformer-remark`
  ]
}
