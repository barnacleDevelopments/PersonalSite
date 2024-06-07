const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");

// TODO: Update the source of projects to IPFS.

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  function genPostPage(node, post) {
    createPage({
      path: `${node.fields.slug}`,
      component: path.resolve(`src/templates/BlogPost.js`),
      context: {
        title: post.title,
        slug: node.fields.slug,
      },
    });
  }

  function genProjectPage(node, project) {
    createPage({
      path: `${node.fields.slug}`,
      component: path.resolve(`src/templates/Project.js`),
      context: {
        title: project.title,
        slug: node.fields.slug,
      },
    });
  }

  function genCategoryPage(category) {
    createPage({
      path: `/blog/${category}`,
      component: path.resolve(`src/templates/CategoryPosts.js`),
      context: {
        categoryRegex: `//blog/${category}//`,
      },
    });
  }

  genCategoryPage("programming_blog");
  genCategoryPage("misc_blog");

  const projectsResult = graphql(`
    query ProjectsQuery {
      allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "//projects//" } }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              githubLink
              liveLink
              description
              thumbnail {
                childImageSharp {
                  gatsbyImageData
                }
              }
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const project = node.frontmatter;
      genProjectPage(node, project);
    });
  });

  const postsResult = graphql(`
    query BlogQuery {
      allMarkdownRemark(filter: { fileAbsolutePath: { regex: "//blog//" } }) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              content
              date
              thumbnail {
                childImageSharp {
                  gatsbyImageData
                }
              }
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      Promise.reject(results.errors);
    }
    // generate individual pages for each post
    result.data.allMarkdownRemark.edges.forEach(({ node }) => {
      const post = node.frontmatter;
      genPostPage(node, post);
    });
  });

  return Promise.all([postsResult, projectsResult]);
};

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions;

  if (node.internal.type === `MarkdownRemark`) {
    let path;
    if (node.frontmatter.path) {
      path = node.frontmatter.path;
    } else {
      path = createFilePath({ node, getNode });
    }

    createNodeField({
      name: `slug`,
      node,
      value: path,
    });
  }
};

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig();
  if (config.externals && config.externals[0]) {
    config.externals[0]["node:crypto"] = require.resolve("crypto-browserify");
  }
  actions.replaceWebpackConfig(config);
};
