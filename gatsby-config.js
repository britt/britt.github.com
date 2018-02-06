module.exports = {
  siteMetadata: {
    title: 'brittcrawford.com',
    description: 'Britt Crawford is just a guy who lives in Salem with his family.',
    siteUrl: 'https://brittcrawford.com'
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
    {
      resolve: 'gatsby-plugin-feed',
      feeds: [
        {
          output: 'rss.xml'
        }
      ]
    }
  ]
}
