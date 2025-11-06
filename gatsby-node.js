const { createFilePath } = require("gatsby-source-filesystem");
require("dotenv").config();
const path = require("path");

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type ContentJsonCurrently_reading {
      id: String
      title: String
      author: String
      publisher: String
      description: String
      last_read: Date
      progress_percent: Int
      read_status: Int
      cover_image_id: String
      isbn: String
      goodreads_url: String
    }
    type ContentJsonRecently_finished {
      title: String
      author: String
      finished_date: Date
      isbn: String
    }
  `;
  createTypes(typeDefs);
};

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
        frontmatter: node.frontmatter,
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
          frontmatter: { draft: { eq: false } }
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
              draft
              image1 {
                childImageSharp {
                  gatsbyImageData
                }
              }
              image2 {
                childImageSharp {
                  gatsbyImageData
                }
              }
              image3 {
                childImageSharp {
                  gatsbyImageData
                }
              }
              technologies {
                name
                image {
                  childImageSharp {
                    gatsbyImageData
                    original {
                      src
                    }
                  }
                }
              }
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
        filter: {
          internal: { contentFilePath: { regex: "/content/blog/" } }
          frontmatter: { draft: { eq: false } }
        }
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
          internal: { contentFilePath: { regex: "/content/blog/" } }
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
              category
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
  actions.replaceWebpackConfig(config);
};
