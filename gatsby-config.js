require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    siteUrl: "https://devdeveloper.ca",
    title: "Devin Davis | Full-Stack Developer & Devops Engineer",
    image: {
      src: `assets/logo_2.png`,
      width: 110,
      height: 110,
    },
    titleTemplate: "Full-Stack Developer & Devops Engineer",
    defaultTitle: "Devin Davis | Full-Stack Developer & Devops Engineer",
    description:
      "Explore the professional portfolio of Devin Davis, a results-oriented Full-Stack Web Developer specializing Devops and Blockchain.",
    lang: "en",
    keywords: [
      "Web development",
      "Full-stack Web developer",
      "JavaScript Frameworks",
      "React developer",
      "Angular",
      "Node.js",
      "Next.Js",
      "Front-end",
      "Back-end",
      "Smart contract",
      "Blockchain",
      "Devops engineer",
      "DApp development",
      "Decentralized applications",
      "Web3 development",
      "Smart contracts",
      "Blockchain technology",
      "API integration",
      "CI/CD pipelines",
      "Devin Davis portfolio",
    ],
  },
  plugins: [
    "gatsby-plugin-sitemap",
    {
      resolve: `gatsby-plugin-feed`,
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
            serialize: ({ query: { site, allMarkdownRemark } }) => {
              return allMarkdownRemark.edges.map((edge) => {
                return Object.assign({}, edge.node.frontmatter, {
                  description: edge.node.excerpt,
                  date: edge.node.frontmatter.date,
                  url: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
                  custom_elements: [{ "content:encoded": edge.node.html }],
                });
              });
            },
            query: `
              {
                allMarkdownRemark(
                  filter: {
                    fileAbsolutePath: { regex: "//blog//" }
                    frontmatter: { draft: { eq: false } }
                  }
                  sort: { frontmatter: { date: DESC } }
                ) {
                  edges {
                    node {
                      fields {
                        slug
                      }
                      frontmatter {
                        title
                        date
                      }
                      html
                      excerpt(truncate: true, format: HTML, pruneLength: 100)
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: "DevDeveloper RSS Feed",
          },
        ],
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-embed-video",
            options: {
              width: 800,
              ratio: 1.77, // Optional: Defaults to 16/9 = 1.77
              height: 400, // Optional: Overrides optional.ratio
              related: false, //Optional: Will remove related videos from the end of an embedded YouTube video.
              noIframeBorder: true, //Optional: Disable insertion of <style> border: 0
              loadingStrategy: "lazy", //Optional: Enable support for lazy-load offscreen iframes. Default is disabled.
              containerClass: "embedVideo-container", //Optional: Custom CSS class for iframe container, for multiple classes separate them by space
              iframeId: false, //Optional: if true, iframe's id will be set to what is provided after 'video:' (YouTube IFrame player API requires iframe id)
            },
          },
          "gatsby-remark-responsive-iframe",
          "gatsby-remark-relative-images",
          {
            resolve: `gatsby-remark-images`,
            options: {},
          },
          {
            resolve: "gatsby-remark-prismjs",
            options: {},
          },
        ],
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        path: `${__dirname}/static/assets`,
        name: "images",
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
      resolve: "gatsby-plugin-theme-ui",
      options: {
        preset: require(`${__dirname}/src/theme/theme.js`),
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `devdeveloper`,
        short_name: `devdeveloper`,
        start_url: `/`,
        background_color: `#FFF`,
        theme_color: `#30362F`,
        display: `standalone`,
        icon: "src/images/logo_2.png",
        description: "personal engineer portfolio for Devin Davis",
      },
    },
    {
      resolve: `gatsby-plugin-csp`,
      options: {
        mergeScriptHashes: false,
        mergeStyleHashes: false,
        directives: {
          "script-src": `'self' 'unsafe-inline' data: www.google-analytics.com`,
          "style-src": `'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com`,
          "img-src": `'self' data: www.google-analytics.com api.daily.dev`,
          "font-src": `'self' data: fonts.gstatic.com`,
          "connect-src": "'self'",
          "frame-src": `'self' player.vimeo.com`,
        },
      },
    },
    "gatsby-plugin-react-helmet",
    `gatsby-plugin-image`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /images/, // TODO See below to configure properly
        },
      },
    },
    `gatsby-plugin-smoothscroll`,
  ],
};
