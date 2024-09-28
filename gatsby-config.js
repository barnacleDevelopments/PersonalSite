require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    url: "https://devdeveloper.ca/",
    title: "devdeveloper",
    image: {
      src: `assets/logo_2.png`,
      width: 110,
      height: 110,
    },
    titleTemplate: "devdeveloper portfolio",
    defaultTitle: "devdeveloper portfolio",
    description: "my personal porfolio site",
    lang: "en",
    keywords: [
      "Web development",
      "Full-stack developer",
      "JavaScript developer",
      "React developer",
      "Angular developer",
      "Node.js developer",
      "Front-end development",
      "Back-end development",
      "Smart contract developer",
      "Blockchain development",
      "Ethereum developer",
      "Solidity developer",
      "DApp development",
      "Decentralized applications",
      "Web3 development",
      "Smart contracts",
      "Blockchain technology",
      "DeFi developer",
      "NFT developer",
      "API integration",
    ],
  },
  plugins: [
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
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
        icon: "src/images/logo.png",
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
          "img-src": `'self' data: www.google-analytics.com`,
          "font-src": `'self' data: fonts.gstatic.com`,
          "connect-src": "'self' wss://eth-sepolia.g.alchemy.com",
        },
      },
    },
    {
      // TODO: Fix this
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: "https://devdeveloper.ca",
        sitemap: "https://devdeveloper.ca/sitemap.xml",
        policy: [{ userAgent: "Mediapartners-Google*", allow: "/" }],
      },
    },
    "gatsby-plugin-react-helmet",
    `gatsby-plugin-image`,
    {
      resolve: "gatsby-plugin-react-svg",
      options: {
        rule: {
          include: /images/, // See below to configure properly
        },
      },
    },
    `gatsby-plugin-smoothscroll`,
  ],
};
