require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    url: "https://devs-webshop.tech/",
    title: "Dev's Web Shop",
    image: {
      src: `assets/logo_2.png`,
      width: 110,
      height: 110
    },
    titleTemplate: "Web Development Services",
    defaultTitle: "Web Development Services",
    description: "Web development services for small business and startups. Get in touch!",
    lang: "en",
    keywords: ["webdev", "developer", "gatsby", "web services", "website development"]
  },
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          'gatsby-remark-relative-images',
          {
            resolve: `gatsby-remark-images`,
            options: {},
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {

            }
          },

        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/static/assets`,
        name: 'images',
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `content`,
        path: `${__dirname}/content`,
      },
    },

    {
      resolve: 'gatsby-plugin-theme-ui',
      options: {
        preset: require(`${__dirname}/src/theme/theme.js`)
      }
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `DEV'S WEB SHOP`,
        short_name: `DEV'S SHOP`,
        start_url: `/`,
        background_color: `#FFF`,
        theme_color: `#30362F`,
        display: `standalone`,
        icon: "src/images/logo.png",
        description: "Web development services for small business and startups. Get in touch!"
      },
    },
    {
      resolve: "gatsby-plugin-netlify-cms",
      options: {
        /**
         * One convention is to place your Netlify CMS customization code in a
         * `src/cms` directory.
         */
        modulePath: `${__dirname}/src/cms/cms.js`,
      },
    },
    {
      resolve: `gatsby-plugin-csp`,
      options: {
        disableOnDev: true,
        reportOnly: false, // Changes header to Content-Security-Policy-Report-Only for csp testing purposes
        mergeScriptHashes: false,
        mergeStyleHashes: false,
        directives: {
          "script-src": "'self' 'unsafe-inline' 'unsafe-eval' google-analytics.com pagead2.googlesyndication.com adservice.google.ca adservice.google.com partner.googleadservices.com tpc.googlesyndication.com",
          "style-src": "'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com",
          'font-src': "fonts.gstatic.com",
          'connect-src': "'self' pagead2.googlesyndication.com",
          'frame-src': "googleads.g.doubleclick.net www.google.com tpc.googlesyndication.com",
          'img-src': "'self' data: pagead2.googlesyndication.com"
          // you can add your directives or override defaults
        }
      }
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: 'https://www.devs-webshop.tech',
        sitemap: 'https://www.devs-webshop.tech/sitemap.xml',
        policy: [{ userAgent: 'Mediapartners-Google*', allow: '/' }]
      }
    },
    'gatsby-plugin-react-helmet',
    `gatsby-plugin-image`,
  ],
};
