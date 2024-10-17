/** @jsx jsx */
import { Link, Paragraph, Progress, jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import ProjectCard from "../components/projects/ProjectCard";
import { Box, Spinner, Heading, Button, Flex, Text } from "theme-ui";
import Seo from "../components/app/Seo";
import { useContext, useEffect, useState } from "react";
import WalletBanner from "../components/projects/WalletBanner";
import ProgressGauge from "../components/projects/ProgressGauge";
import ContributionForm from "../components/projects/ContributionForm";
import VoterList from "../components/projects/VoterList";
import Dialog from "../components/dialog";

// Contexts
import { WalletContext } from "../contexts/WalletContext";

// Functions
import {
  vote,
  checkHasVoted,
  getVote,
  getBalance,
  getWinners,
  getVoters,
  getThreshold,
  getProjectVoteCounts,
} from "../functions/project-voting";

const ProjectsPage = ({ data }) => {
  const [voteCounts, setVoteCounts] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [balance, setBalance] = useState(0);
  const [contribution, setContribution] = useState(0);
  const [name, setName] = useState("");
  const [addressVote, setAddressVote] = useState();
  const [winners, setWinners] = useState({});
  const [voters, setVoters] = useState([]);
  const [threshold, setThreshold] = useState(0);
  const [voteStarted, setVoteStarted] = useState(false);
  const [voteConfirmed, setVoteConfirmed] = useState(false);

  const walletContext = useContext(WalletContext);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const init = async () => {
        await updateThreshold();
        await updateVoteStates();
      };
      init();
    }
  }, [walletContext?.walletAddress, walletContext?.isWalletConnected]);

  const getProjectWithContent = () => {
    const projectData = data.allMarkdownRemark.edges.map(({ node }) => {
      console.log(node);
      return {
        ...node.fields,
        ...node.frontmatter,
      };
    });
    if (projectData.length > 0) {
      return projectData.map((project) => {
        return {
          title: project.title,
          votes: 0,
          link: project.slug,
        };
      });
    }
  };

  const projects = getProjectWithContent();

  const updateVoteStates = async () => {
    if (walletContext?.walletAddress) {
      await updateHasVoted();
      await updateAddressVote();
    }

    await updateVotes();
    await updateThreshold();
    await updateBalance();
    await updateWinners();
    await updateVoters();
  };

  const voteForProject = async (id) => {
    try {
      await walletContext?.checkNetwork();
      validateContributionInput(name, parseFloat(contribution));
      setVoteStarted(true);
      await vote(id, contribution, name);
      await updateVoteStates();
      await updateVotes();
      setVoteConfirmed(true);
    } catch (error) {
      alert(error.message);
      setVoteStarted(false);
    }
  };

  const validateContributionInput = (name, contributionAmount) => {
    if (typeof name !== "string" || name.length <= 0)
      throw new Error(`Must provide a display name`);
    if (typeof contributionAmount !== "number")
      throw new Error(`Must provide a contribution amount`);
    if (isNaN(contributionAmount))
      throw new Error(`Contribution amount must be a number`);
    if (contributionAmount < 0.001 || contributionAmount > 0.05)
      throw new Error(
        `Contribution amount must be greater than 0.001 and less than 0.05`,
      );
  };

  const updateAddressVote = async () => {
    const vote = await getVote(walletContext?.walletAddress);
    setAddressVote(vote);
  };

  const updateWinners = async () => {
    const winners = await getWinners();
    setWinners(winners);
  };

  const updateVoters = async () => {
    const voters = await getVoters();
    setVoters(voters);
  };

  const updateHasVoted = async () => {
    const hasVoted = await checkHasVoted(walletContext?.walletAddress);
    setHasVoted(hasVoted);
  };

  const updateBalance = async () => {
    const balance = await getBalance();
    setBalance(balance);
  };

  const updateThreshold = async () => {
    const threshold = await getThreshold();
    setThreshold(threshold);
  };

  const updateVotes = async () => {
    const voteCounts = await getProjectVoteCounts();
    setVoteCounts(voteCounts);
  };

  const getProjectVotes = (id) => {
    return voteCounts[id] ? voteCounts[id] : 0;
  };

  return (
    <Box>
      <Dialog isOpen={voteStarted}>
        {!voteConfirmed ? (
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Heading sx={{ mb: 2 }} as="h2" variant="large">
              Transaction Started
            </Heading>
            <Text>please wait...</Text>
          </Box>
        ) : (
          <Box>
            <Heading
              as="h2"
              variant="large"
              sx={{ textAlign: "center", mb: 2 }}
            >
              Transaction Confirmed
            </Heading>
            <Text sx={{ mb: 3, display: "block", textAlign: "center" }}>
              Thank You! ❤️
            </Text>
          </Box>
        )}
        <Progress max={1} value={!voteConfirmed ? 1 / 2 : 1} />
        <Flex sx={{ justifyContent: "center", mt: 3 }}>
          <Button
            disabled={!voteConfirmed}
            onClick={() => {
              setVoteStarted(false);
              setVoteConfirmed(false);
            }}
          >
            Close
          </Button>
        </Flex>
      </Dialog>
      <Seo title="Projects" />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          mt: "60px",
          my: 5,
        }}
      >
        <Box sx={{ mt: 6, mb: [3, 4] }}>
          <Box as="section">
            <Heading as="h1" variant="hero">
              Projects
            </Heading>
            <Paragraph variant="large">
              Discover a selection of my latest projects. If you're interested
              in collaboration or want to learn more, feel free to{" "}
              <Link href="/contact">contact me</Link>. Plus, take a moment to
              provide feedback on a project and you might win a prize!
            </Paragraph>
            <Heading as="h2" variant="subheading1" sx={{ mt: 4 }}>
              Participate in Web3 Voting
            </Heading>
            <Paragraph variant="regular" sx={{ mt: 3 }}>
              Embracing the new era of Web3, I'm on a mission to educate
              newcomers about blockchain technology. To make it interactive,
              I've set up an incentive-based decentralized feedback system for
              my projects. You have the chance to provide feedback and earn
              rewards, with every comment securely recorded on the Ethereum
              blockchain. I'll personally select the winner based on the quality
              of the feedback, and the top projects and comments will be
              featured on my homepage! To learn more about this open feedback
              system,
              <a href="https://github.com/barnacleDevelopments/PersonalSite">
                visit the project on GitHub
              </a>
              . Do your worst—and let's build something great together!
            </Paragraph>{" "}
          </Box>
          <WalletBanner
            walletAddress={walletContext?.walletAddress}
            isWalletConnected={walletContext?.isWalletConnected}
            hasVoted={hasVoted}
            threshold={threshold}
            onConnectClick={walletContext?.connectWallet}
          ></WalletBanner>
          <ProgressGauge
            currentProgress={balance}
            maxProgress={threshold}
          ></ProgressGauge>
          {/* <JudgementGrid projects={projects}></JudgementGrid> */}
          {voters?.length > 0 && (
            <VoterList winners={winners} voters={voters}></VoterList>
          )}
          {!hasVoted && walletContext?.walletAddress && (
            <ContributionForm
              onContributionInput={(value) => setContribution(value)}
              onNameInput={(value) => setName(value)}
            ></ContributionForm>
          )}
        </Box>
        <Box
          as="section"
          sx={{
            mb: 3,
          }}
        >
          {projects.map((project, index) => {
            return (
              <Box key={project.id} id={"id" + project.id} mb={3}>
                <ProjectCard
                  id={project.id}
                  image={project.image1}
                  title={project.title}
                  siteLink={project.link}
                  key={index}
                  buttonText={"View"}
                  vote={voteForProject}
                  hasVoted={hasVoted}
                  voteCount={0}
                  isVote={false}
                />
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export const projectsQuery = graphql`
  query ProjectsPageQuery {
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: "//projects//" } }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            image1
            description
          }
        }
      }
    }
  }
`;

export default ProjectsPage;
