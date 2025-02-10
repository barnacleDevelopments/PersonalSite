const { createFilePath } = require("gatsby-source-filesystem");
require("dotenv").config();
const path = require("path");

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  function genPostPage(node, post) {
    createPage({
      path: `${node.fields.slug}`,
      component: `${path.resolve(`./src/templates/BlogPostPage.js`)}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        title: post.title,
        slug: node.fields.slug,
      },
    });
  }

  async function genProjectPage(node, project) {
    createPage({
      path: node.fields.slug,
      component: `${path.resolve(`./src/templates/ProjectPage.js`)}?__contentFilePath=${node.internal.contentFilePath}`,
      context: {
        title: project.title,
        slug: node.fields.slug,
      },
    });
  }

  function genCategoryPage(category) {
    createPage({
      path: `/blog/${category}`,
      component: path.resolve(`src/templates/CategoryPage.js`),
      context: {
        category: category,
      },
    });
  }

  const projectsResult = graphql(`
    query ProjectsQuery {
      allMdx(
        filter: {
          internal: { contentFilePath: { regex: "/content/projects/" } }
        }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `)
    .then((result) => {
      if (result.errors) {
        Promise.reject(result.errors);
      }
      result.data.allMdx.edges.forEach(({ node }) => {
        const project = node.frontmatter;
        genProjectPage(node, project);
      });
    })
    .catch((error) =>
      console.log("Error occured while generating project pages", error),
    );

  const categoryResult = graphql(`
    query ProjectsPageQuery {
      allMdx(
        filter: { internal: { contentFilePath: { regex: "/content/posts/" } } }
      ) {
        distinct(field: { frontmatter: { category: SELECT } })
      }
    }
  `).then((result) => {
    if (result.errors) {
      Promise.reject(result.errors);
    }

    result.data.allMdx.distinct.forEach((category) => {
      genCategoryPage(category);
    });
  });

  const postsResult = graphql(`
    query BlogQuery {
      allMdx(
        filter: {
          frontmatter: { draft: { eq: false } }
          internal: { contentFilePath: { regex: "/content/posts/" } }
        }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
            }
            internal {
              contentFilePath
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      Promise.reject(results.errors);
    }
    result.data.allMdx.edges
      .filter(({ node }) => {
        return !node.frontmatter.draft;
      })
      .forEach(({ node }) => {
        const post = node.frontmatter;
        genPostPage(node, post);
      });
  });

  return Promise.allSettled([categoryResult, postsResult, projectsResult]);
};

exports.onCreateNode = async ({
  node,
  actions: { createNodeField },
  getNode,
}) => {
  if (node.internal.type === `Mdx`) {
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
