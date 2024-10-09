const { createFilePath } = require("gatsby-source-filesystem");
const { assert } = require("console");
const Arweave = require("arweave");
require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
const path = require("path");
const projectVotingABI = require("./smart-contracts-hardhat/artifacts/contracts/project-voting.sol/ProjectVoting.json");
const { Web3 } = require("web3");

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
    console.log("DEBUG: ", project);
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

async function fetchArweaveContent(txIds) {
  try {
    const arweave = Arweave.init({
      host: "arweave.net",
      port: 443,
      protocol: "https",
      timeout: 20000,
      logging: false,
    });
    return await Promise.all(
      txIds.map(async (txId) => {
        const data = await arweave.transactions.getData(txId, {
          decode: true,
          string: true,
        });
        return { txId, data };
      }),
    );
    console.log("Transaction Data:", results);
  } catch (error) {
    console.error("Error fetching transaction data:", error);
  }
}

async function fetchContractProjectHashes() {
  const provider = new Web3(process.env.GATSBY_WEB3_WS_URL);
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  return await contract.methods.getProjectIds().call();
}

async function writeProjectFiles() {
  try {
    const projectIds = await fetchContractProjectHashes();
    const projectContent = await fetchArweaveContent(projectIds);
    if (!fs.existsSync(path.resolve(__dirname, "content", "projects"))) {
      fs.mkdirSync(path.resolve(__dirname, "content", "projects"), {
        recursive: true,
      });
    }
    for (let project of projectContent) {
      const markdownString = `${project.data.slice(0, 3)}
txId: ${project.txId}${project.data.slice(3)}`;
      const filePath = path.resolve(
        __dirname,
        "content",
        "projects",
        project.txId + ".md",
      );
      fs.writeFileSync(filePath, markdownString);
    }
  } catch (error) {
    console.error(
      "DEBUG: There was an error while writing project files to filesystem.",
    );
  }
}

exports.onPreInit = async () => {
  //await writeProjectFiles();
};
