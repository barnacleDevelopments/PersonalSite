/** @jsx jsx */
import { Link, jsx } from "theme-ui";
import { graphql } from "gatsby";
import scrollTo from "gatsby-plugin-smoothscroll";

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
  const [addressVote, setAddressVote] = useState();
  const { hasVoted, getVoteCount, vote, checkHasVoted, getVote } =
    useProjectVoting();
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const init = async () => {
        await fetchVoteCount();
        await checkHasVoted();
        const vote = await getVote();
        setAddressVote(vote);
      };

      init();
    }
  }, [walletContext?.walletAddress]);

  const voteForProject = async (id) => {
    await vote(id);
    await fetchVoteCount();

    if (hasVoted) {
      setAddressVote(id);
    }
  };

  const getProject = () => {
    const project = pageData.find(
      (project) => project.node.frontmatter.id === addressVote
    );

    if (!project) return "";

    return project.node.frontmatter;
  };

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
            Discover a selection of my latest projects! If you're interested in
            collaboration or want to learn more, feel free to{" "}
            <Link href="/contact">contact me</Link> or explore my{" "}
            <Link href="/about">services and rates</Link>. Plus, take a moment
            to vote for your favorite project and see what others are loving!
          </Text>
          <Box>
            <Themed.h2 sx={{ mt: 4 }}>Participate in Web3 Voting</Themed.h2>
            <Text variant="regular" sx={{ mt: 3 }}>
              Embracing the new era of Web3, I've integrated a decentralized
              voting system for my projects. Your votes, securely recorded on
              the Ethereum blockchain. You can help highlight the most popular
              projects.
            </Text>
            <Box
              p={4}
              mt={4}
              sx={{
                backgroundColor: !walletContext?.isWalletConnected
                  ? "primary"
                  : "orange",
                borderRadius: "10px",
                overflow: "hidden",
              }}
            >
              <Flex
                sx={{
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  {/* title */}
                  {!walletContext?.isWalletConnected ? (
                    <Themed.h2 sx={{ color: "white" }}>
                      Connect Wallet & Vote
                    </Themed.h2>
                  ) : (
                    <Themed.h2 sx={{ color: "white" }}>
                      Your wallet is connected
                    </Themed.h2>
                  )}
                  {/* body */}
                  {!walletContext?.isWalletConnected ? (
                    <Text variant="regular" sx={{ mt: 3, color: "white" }}>
                      Join the Web3 revolution! Connect your Ethereum wallet,
                      like{" "}
                      <Link target="_blank" href="https://metamask.io">
                        MetaMask
                      </Link>
                      , to participate. Your vote is secure and tamper-proof,
                      thanks to blockchain technology. .
                    </Text>
                  ) : hasVoted ? (
                    <Text
                      variant="small"
                      sx={{
                        color: "white",
                      }}
                    >
                      You've already cast your vote for{" "}
                      <a onClick={() => scrollTo(`#id${getProject()?.id}`)}>
                        {getProject()?.title}
                      </a>
                      . Thank you for participating!
                    </Text>
                  ) : (
                    <Text variant="regular" sx={{ mt: 3, color: "white" }}>
                      Ready to vote? Select your favorite project and confirm
                      the transaction via MetaMask. Your vote will be recorded
                      on the Ethereum blockchain via the Sepolia Test Network.
                      Please be patient as processing may take a few minutes.
                      This is a beta release before official mainnet
                      implementation.
                    </Text>
                  )}
                  <Box mt={3} sx={{ color: "white" }}>
                    {walletContext?.walletAddress ? (
                      <Text variant="regular" color="white">
                        {`Connected as ${truncateAddress(
                          walletContext?.walletAddress
                        )}`}
                      </Text>
                    ) : (
                      <Button
                        sx={{ display: "flex", alignItems: "center" }}
                        onClick={walletContext?.connectWallet}
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
              <Box id={"id" + project.id}>
                <ProjectCard
                  id={project.id}
                  image={project.image1}
                  title={project.title}
                  siteLink={node.fields.slug}
                  key={index}
                  buttonText={"View"}
                  vote={voteForProject}
                  hasVoted={hasVoted}
                  voteCount={voteCounts[project.id]}
                  isVote={addressVote === project.id}
                />
              </Box>
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
