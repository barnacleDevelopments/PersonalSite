/** @jsx jsx */
import { Link, jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import ProjectCard from "../components/cards/ProjectCard";
import { Box, Text, Themed, Grid } from "theme-ui";
import Seo from "../components/app/Seo";
import { useContext, useEffect, useState } from "react";
import { Button, Flex } from "theme-ui";

// Hooks
import useProjectVoting from "../hooks/project-voting";

// Contexts
import { WalletContext } from "../contexts/WalletContext";

import MetaMask from "../images/meta-mask.svg";

const ProjectsPage = ({ data }) => {
  const pageData = data.allMarkdownRemark.edges;
  const [voteCounts, setVoteCounts] = useState({});
  const { hasVoted, getVoteCount, voteForProject, checkHasVoted } =
    useProjectVoting();
  const { walletAddress, connectWallet, isWalletConnected } =
    useContext(WalletContext);

  useEffect(() => {
    const init = async () => {
      await checkHasVoted();
      await fetchVoteCount();
    };

    init();
  }, []);

  const fetchVoteCount = async () => {
    const counts = {};
    for (const { node } of pageData) {
      const count = await getVoteCount(node.frontmatter.id);
      counts[node.frontmatter.id] = count;
    }
    setVoteCounts(counts);
  };

  const truncateAddress = (address) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  return (
    <Box>
      <Seo title="Projects" />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          my: 5,
        }}
      >
        <Box sx={{ mt: 6, mb: 5 }} textAlign="center">
          <Themed.h1
            sx={{
              mb: 3,
              color: "primary",
            }}
          >
            Projects
          </Themed.h1>
          <Text variant="large">
            Here are a few of my projects! I'm always looking for new projects
            to work on so
            <Link href="/contact"> let's get in touch</Link> or
            <Link href="/about"> try my estimate feature</Link>! While you are
            here why not vote for your favourite project?
          </Text>
          <Box>
            <Themed.h2 sx={{ mt: 4 }}>How to Vote - Web3</Themed.h2>
            <Text variant="regular" sx={{ mt: 3 }}>
              Web3 is a trending topic in the web development world. It is a
              collection of technologies that enable the creation of
              decentralized applications. In the spirit of Web3, I've created a
              decentralized voting feature for my projects.
            </Text>

            <Box
              p={4}
              mt={4}
              sx={{
                backgroundColor: !isWalletConnected ? "primary" : "orange",
              }}
            >
              <Flex sx={{ justifyContent: "space-between" }}>
                <Box>
                  {!isWalletConnected ? (
                    <Themed.h2 sx={{ color: "white" }}>
                      Connect Wallet & Vote
                    </Themed.h2>
                  ) : (
                    <Themed.h2 sx={{ color: "white" }}>
                      Your wallet is connected
                    </Themed.h2>
                  )}
                  {!isWalletConnected ? (
                    <Text variant="regular" sx={{ mt: 3, color: "white" }}>
                      Voting is done using a the Ethereum blockchain. This means
                      that your vote is immutable and can't be tampered with. To
                      vote you'll need to connect your Ethereum wallet such as
                      MetaMask.
                    </Text>
                  ) : hasVoted ? (
                    <Text>You have already voted using this wallet.</Text>
                  ) : (
                    <Text variant="regular" sx={{ mt: 3, color: "white" }}>
                      You can vote for your favourite project by clicking the
                      vote button on the project card. Metamask will prompt you
                      to confirm the transaction. Once you confirm your vote it
                      will be recorded on the Ethereum blockchain. Please be
                      patient as it may take a few minutes for your vote to be
                      recorded because the Ethereum blockchain is slow.
                    </Text>
                  )}
                  <Box mt={3} sx={{ color: "white" }}>
                    {walletAddress ? (
                      <Text variant="regular" color="white">
                        {`Connected as ${truncateAddress(walletAddress)}`}
                      </Text>
                    ) : (
                      <Button
                        sx={{ display: "flex", alignItems: "center" }}
                        onClick={connectWallet}
                      >
                        <Box mr={3}>Connect</Box> <MetaMask width="25px" />{" "}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Flex>
            </Box>

            <Text variant="regular"></Text>
          </Box>
        </Box>
        <Grid
          sx={{
            mb: 6,
          }}
          gap={3}
          columns={[1, null, 2, 3]}
        >
          {pageData.map(({ node }, index) => {
            const project = node.frontmatter;
            return (
              <ProjectCard
                id={project.id}
                image={project.image1}
                title={project.title}
                siteLink={node.fields.slug}
                key={index}
                buttonText={"View"}
                voteForProject={voteForProject}
                hasVoted={hasVoted}
                voteCount={voteCounts[project.id]}
              />
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProjectsPage;

export const landingPageQuery = graphql`
  query ProjectsPageQuery {
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: "//projects//" } }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            id
            title
            overLink
            image1 {
              childImageSharp {
                gatsbyImageData
              }
            }
            description
          }
        }
      }
    }
  }
`;
