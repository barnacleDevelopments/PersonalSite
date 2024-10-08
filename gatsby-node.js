const path = require("path");
const { createFilePath } = require("gatsby-source-filesystem");
const { assert } = require("console");
const fs = require("fs");
const crypto = require("crypto");

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions;

  function genPostPage(node, post) {
    createPage({
      path: `${node.fields.slug}`,
      component: path.resolve(`src/templates/BlogPostPage.js`),
      context: {
        title: post.title,
        slug: node.fields.slug,
      },
    });
  }

  const getHash = (path) =>
    new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha256");
      const rs = fs.createReadStream(path);
      rs.on("error", reject);
      rs.on("data", (chunk) => hash.update(chunk));
      rs.on("end", () => resolve(hash.digest("hex")));
    });

  async function genProjectPage(node, project) {
    const projectHash = await getHash(
      __dirname +
        `/content${node.fields.slug.slice(0, node.fields.slug.length - 1)}.md`,
    );
    createPage({
      path: `/projects/${projectHash}`,
      component: path.resolve(`src/templates/ProjectPage.js`),
      context: {
        title: project.title,
        slug: node.fields.slug,
        hash: projectHash,
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

  const categoryResult = graphql(`
    query ProjectsPageQuery {
      allMarkdownRemark(filter: { frontmatter: { draft: { eq: false } } }) {
        distinct(field: { frontmatter: { category: SELECT } })
      }
    }
  `).then((result) => {
    if (result.errors) {
      Promise.reject(result.errors);
    }

    result.data.allMarkdownRemark.distinct.forEach((category) => {
      genCategoryPage(category);
    });
  });

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
              status
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
      if (project.status === "complete") {
        genProjectPage(node, project);
      }
    });
  });

  const postsResult = graphql(`
    query BlogQuery {
      allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "//blog//" }
          frontmatter: { draft: { eq: false } }
        }
      ) {
        edges {
          node {
            fields {
              slug
            }
            frontmatter {
              title
              startDate
              endDate
              draft
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
    result.data.allMarkdownRemark.edges
      .filter(({ node }) => {
        return !node.frontmatter.draft;
      })
      .forEach(({ node }) => {
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
