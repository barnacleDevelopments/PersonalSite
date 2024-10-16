const { createFilePath } = require("gatsby-source-filesystem");
const Arweave = require("arweave");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

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

  async function genProjectPage(node, project) {
    createPage({
      path: node.fields.slug,
      component: path.resolve(`src/templates/ProjectPage.js`),
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
      result.data.allMarkdownRemark.edges.forEach(({ node }) => {
        const project = node.frontmatter;
        genProjectPage(node, project);
      });
    })
    .catch((error) =>
      console.log("Error occured while generating project pages", error),
    );

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

  // TODO: create image node from URL source: https://mcro.tech/blog/gatsby-image-sharp/
  // create markdown nodes from arweave content

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
            }
          }
        }
      }
    }
  `).then((result) => {
    if (result.errors) {
      Promise.reject(results.errors);
    }
    result.data.allMarkdownRemark.edges
      .filter(({ node }) => {
        return !node.frontmatter.draft;
      })
      .forEach(({ node }) => {
        const post = node.frontmatter;
        genPostPage(node, post);
      });
  });

  return Promise.allSettled([postsResult, projectsResult, categoryResult]);
};

exports.onCreateNode = async ({
  node,
  actions: { createNode, createNodeField },
  createNodeId,
  getNode,
}) => {
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
  // TODO: fix this so that I can use gatsby to render images
  // For all MarkdownRemark nodes that have a featured image url, call createRemoteFileNode
  if (
    node.internal.type === "MarkdownRemark" &&
    node.frontmatter.image1 !== null
  ) {
    const fileNode = await createRemoteFileNode({
      url: node.frontmatter.image1, // string that points to the URL of the image
      parentNodeId: node.id, // id of the parent node of the fileNode you are going to create
      createNode, // helper function in gatsby-node to generate the node
      createNodeId, // helper function in gatsby-node to generate the node id
      getCache,
    });

    // if the file was created, extend the node with "localFile"
    if (fileNode) {
      createNodeField({ node, name: "localFile", value: fileNode.id });
    }
  }
};

exports.onCreateWebpackConfig = ({ actions, getConfig }) => {
  const config = getConfig();
  if (config.externals && config.externals[0]) {
    config.externals[0]["node:crypto"] = require.resolve("crypto-browserify");
  }
  actions.replaceWebpackConfig(config);
};

async function fetchArweaveContentByCreatorAndTags(
  creatorAddress,
  tagName,
  tagValues,
) {
  // GraphQL reference
  // https://gql-guide.arweave.dev/#sorting
  try {
    const arweave = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
      timeout: 20000,
      logging: false,
    });

    const queryObject = {
      query: `{
        transactions (
          owners:["${creatorAddress}"],
          tags: [
            {
              name: "${tagName}",
              values: [${tagValues.map((x) => `"${x}"`).join(",")}]
            }
          ],
          first: 1,
          sort: HEIGHT_DESC
        ) {
          edges {
            node {
              id
            }
          }
        }
      }`,
    };

    const results = await arweave.api.post("/graphql", queryObject);

    const txIds = results.data.data.transactions.edges.map(
      ({ node }) => node.id,
    );

    return await Promise.all(
      txIds.map(async (txId) => {
        const data = await arweave.transactions.getData(txId, {
          decode: true,
          string: true,
        });
        return { txId, data: data };
      }),
    );
  } catch (error) {
    console.error(
      "Error fetching content by creator and file name tag:",
      error,
    );
  }
}

async function writeProjectFiles() {
  try {
    const fileNames = [
      "evernote-clone.md",
      "brewers-insight-packaging-bom.md",
      "brewers-insight-planning-and-forecasting.md",
      "myboards.md",
      "novajonstone-co.md",
      "ressons-marketing-website.md",
    ];

    const projectDataQueries = fileNames.map((x) =>
      fetchArweaveContentByCreatorAndTags(
        "m_k57NPohHi0S3g7lAr0IoOKmfC_3S9676FaF9refWE",
        "File-Name",
        [x],
      ),
    );

    const projectData = await Promise.all(projectDataQueries);

    if (!fs.existsSync(path.resolve(__dirname, "content", "projects"))) {
      fs.mkdirSync(path.resolve(__dirname, "content", "projects"), {
        recursive: true,
      });
    }
    for (let project of projectData) {
      const filePath = path.resolve(
        __dirname,
        "content",
        "projects",
        project[0].txId + ".md",
      );
      fs.writeFileSync(filePath, project[0].data);
    }
  } catch (error) {
    console.error(
      "DEBUG: There was an error while writing project files to filesystem.",
    );
    console.log(error);
  }
}

exports.onPreInit = async () => {
  await writeProjectFiles();
};
