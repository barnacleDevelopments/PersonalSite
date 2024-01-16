/** @jsx jsx */
import { Link, jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import ProjectCard from "../components/projects/ProjectCard";
import { Box, Text, Themed, Grid } from "theme-ui";
import Seo from "../components/app/Seo";
import { useContext, useEffect, useState } from "react";
import WalletBanner from "../components/projects/WalletBanner";
import ProgressGauge from "../components/projects/ProgressGauge";
import ContributionForm from "../components/projects/ContributionForm";
import WinnerList from "../components/projects/WinnerListing";

// Hooks
import useProjectVoting from "../hooks/project-voting";

// Contexts
import { WalletContext } from "../contexts/WalletContext";

const ProjectsPage = ({ data }) => {
  const pageData = data.allMarkdownRemark.edges;
  const [voteCounts, setVoteCounts] = useState({});
  const [balance, setBalance] = useState(0);
  const [contribution, setContribution] = useState(0);
  const [name, setName] = useState("");
  const [addressVote, setAddressVote] = useState();
  const [winners, setWinners] = useState([]);
  const {
    hasVoted,
    getVoteCount,
    vote,
    checkHasVoted,
    getVote,
    threshold,
    getBalance,
    checkStatus,
    getWinners,
  } = useProjectVoting();
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const init = async () => {
        updateVoteStates();
      };

      init();
    }
  }, [walletContext?.walletAddress]);

  const voteForProject = async (id) => {
    try {
      if (!validateContributionInput(name, contribution)) {
        window.alert("Display name or contribution amount not entered.");
        return;
      }
      const hash = await vote(id, contribution, name);
      const succeeded = await checkStatus(hash);
      if (succeeded) {
        await updateVoteStates();
      }
    } catch (error) {
      console.error("Error in voting for project:", error);
    }
  };

  const updateVoteStates = async () => {
    await checkHasVoted();
    await updateBalance();
    await updateWinners();
    await updateVoteCounts();
    await updateAddressVote();
  };

  const validateContributionInput = (name, contributionAmount) => {
    return (
      typeof name === "string" &&
      typeof contributionAmount === "number" &&
      contributionAmount >= 0.001 &&
      contributionAmount <= 0.05 &&
      name.length > 0
    );
  };

  const updateAddressVote = async () => {
    const vote = await getVote();
    setAddressVote(vote);
  };

  const updateWinners = async () => {
    const winners = await getWinners();
    setWinners(winners);
  };

  const updateBalance = async () => {
    const balance = await getBalance();
    console.log("Balance:", balance);
    setBalance(balance);
  };

  const getProject = () => {
    const project = pageData.find(
      (project) => project.node.frontmatter.id === addressVote
    );

    if (!project) return "";

    return project.node.frontmatter;
  };

  const updateVoteCounts = async () => {
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
          mt: "60px",
          my: 5,
        }}
      >
        <Box sx={{ mt: 6, mb: 4 }} textAlign="center">
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
          <Themed.h2 sx={{ mt: 4 }}>Participate in Web3 Voting</Themed.h2>
          <Text variant="regular" sx={{ mt: 3 }}>
            Embracing the new era of Web3, I've integrated a decentralized
            voting system for my projects. Your votes, securely recorded on the
            Ethereum blockchain. You can help highlight the most popular
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
          <ProgressGauge
            currentProgress={balance}
            maxProgress={threshold}
          ></ProgressGauge>
          {winners.length > 0 && <WinnerList winners={winners}></WinnerList>}
          {!hasVoted && walletContext?.walletAddress && (
            <ContributionForm
              onContributionInput={(value) => setContribution(value)}
              onNameInput={(value) => setName(value)}
            ></ContributionForm>
          )}
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
