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
    createPage({
      path: node.fields.slug,
      component: path.resolve(`src/templates/ProjectPage.js`),
      context: {
        title: project.title,
        slug: node.fields.slug,
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
              txId
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
    result.data.allMarkdownRemark.edges
      .filter(({ node }) => {
        return !node.frontmatter.draft;
      })
      .forEach(({ node }) => {
        const post = node.frontmatter;
        genPostPage(node, post);
      });
  });

  return Promise.allSettled([postsResult, projectsResult]);
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

async function fetchProjectContent(txIds) {
  try {
    const arweave = Arweave.init({
      host: "arweave.net", // Hostname or IP address for a Arweave host
      port: 443, // Port
      protocol: "https", // Network protocol http or https
      timeout: 20000, // Network request timeouts in milliseconds
      logging: false, // Enable network request logging
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
  try {
    try {
      const signers = await ethers.getSigners();
      const contractFactory = await ethers.getContractFactory("ProjectVoting");
      const contractInstance = contractFactory.attach(
        process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
      );

      return await contractInstance.getProjectIds();
    } catch (error) {}
  } catch (error) {}
}

async function fetchContractProjectHashes() {
  const provider = new Web3(process.env.GATSBY_WEB3_WS_URL);
  const contract = new provider.eth.Contract(
    projectVotingABI.abi,
    process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS,
  );
  try {
    const result = await contract.methods.getProjectIds().call();
    return result;
  } catch (error) {
    console.error("Error in getProjectById", error);
  }
}

exports.onPreInit = async () => {
  const projectIds = await fetchContractProjectHashes();
  const projectsData = fetchProjectContent(projectIds).then((projects) => {
    if (!fs.existsSync(path.resolve(__dirname, "content", "projects"))) {
      fs.mkdirSync(path.resolve(__dirname, "content", "projects"), {
        recursive: true,
      });
    }
    for (let project of projects) {
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
  });
};
