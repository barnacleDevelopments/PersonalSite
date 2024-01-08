/** @jsx jsx */
import { Link, jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import ProjectCard from "../components/projects/ProjectCard";
import { Box, Text, Themed, Grid } from "theme-ui";
import Seo from "../components/app/Seo";
import { useContext, useEffect, useState } from "react";
import WalletBanner from "../components/projects/WalletBanner";

// Hooks
import useProjectVoting from "../hooks/project-voting";

// Contexts
import { WalletContext } from "../contexts/WalletContext";

const ProjectsPage = ({ data }) => {
  const pageData = data.allMarkdownRemark.edges;
  const [voteCounts, setVoteCounts] = useState({});
  const [addressVote, setAddressVote] = useState();
  const { hasVoted, getVoteCount, vote, checkHasVoted, getVote, threshold } =
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
            to vote for your favorite project and you might win a prize!
          </Text>
          <Box>
            <Themed.h2 sx={{ mt: 4 }}>Participate in Web3 Voting</Themed.h2>
            <Text variant="regular" sx={{ mt: 3 }}>
              Embracing the new era of Web3, I've integrated a decentralized
              voting system for my projects. Your votes, securely recorded on
              the Ethereum blockchain. You can help highlight the most popular
              projects.
            </Text>
            <WalletBanner
              walletAddress={walletContext?.walletAddress}
              project={getProject()}
              isWalletConnected={walletContext?.isWalletConnected}
              hasVoted={walletContext?.hasVoted}
              threshold={threshold}
              onConnectClick={walletContext?.connectWallet}
            ></WalletBanner>
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
              <Box id={"id" + project.id} key={project.id}>
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
