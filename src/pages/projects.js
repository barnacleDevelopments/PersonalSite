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
import { JudgementGrid } from "../components/projects/JudgementGrid";
import Dialog from "../components/dialog";
import Loader from "../components/Loader";
import provider from "../web3-provider";

// Contexts
import { WalletContext } from "../contexts/WalletContext";

// Functions
import {
  getVoteCount,
  vote,
  checkHasVoted,
  getVote,
  getBalance,
  getWinners,
  getProjects,
  getVoters,
  getActionCIDs,
  getThreshold,
  getProjectVoteCounts,
} from "../functions/project-voting";

const ProjectsPage = ({ data }) => {
  const [projects, setProjects] = useState([]);
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
        await getProjectWithContent();
        await updateVoteStates();
      };
      init();
    }
  }, [walletContext?.walletAddress, walletContext?.isWalletConnected]);

  const getProjectWithContent = async () => {
    const projects = await getProjects();
    if (projects && projects.length > 0) {
      const formattedProjects = projects.map((project) => {
        return {
          id: project.id,
          title: project.title,
          votes: 0,
          link: `/projects/${project.id}`,
        };
      });
      formattedProjects.sort((a, b) => a.votes < b.votes);
      setProjects(formattedProjects);
    }
  };

  const updateVoteStates = async () => {
    if (walletContext?.walletAddress) {
      await updateHasVoted();
      await updateAddressVote();
      await updateProjectVoteCounts();
    }

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
      await updateProjectVoteCounts();
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
    console.log(winners);
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

  const getProject = () => {
    const project = projects.find((project) => project.id === addressVote);
    if (!project) return "";
    return project;
  };

  const updateProjectVoteCounts = async () => {
    const voteCounts = await getProjectVoteCounts();
    setProjects((projects) => {
      return projects.map((project) => {
        if (voteCounts[project.id]) {
          return {
            ...project,
            votes: Number.parseFloat(voteCounts[project.id]),
          };
        }
        return project;
      });
    });
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
              vote for your favorite project and you might win a prize!
            </Paragraph>
            <Heading as="h2" variant="subheading1" sx={{ mt: 4 }}>
              Participate in Web3 Voting
            </Heading>
            <Paragraph variant="regular" sx={{ mt: 3 }}>
              Embracing the new era of Web3 and to educate newcomers on
              blockchain technology, I've integrated a decentralized voting
              system for my projects. You can help highlight the most popular
              projects using the power of Ethereum. Your vote will be securely
              recorded on the Ethereum blockchain. A random winner will be
              chosen, using{" "}
              <dfn>
                <Link href="https:chain.link/vrf" target="_blank">
                  Chainlink's VRF random number generator
                </Link>
              </dfn>
              , every time the prize pool reaches the threshold. The top
              projects will appear on my front page!
            </Paragraph>{" "}
          </Box>
          <WalletBanner
            walletAddress={walletContext?.walletAddress}
            project={getProject()}
            isWalletConnected={walletContext?.isWalletConnected}
            hasVoted={hasVoted}
            threshold={threshold}
            onConnectClick={() => {
              walletContext?.connectWallet();
            }}
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
          {projects.length > 0 ? (
            projects.map((project, index) => {
              return (
                <Box id={"id" + project.id} key={project.id} mb={3}>
                  <ProjectCard
                    id={project.id}
                    image={project.image1}
                    title={project.title}
                    siteLink={project.link}
                    key={index}
                    buttonText={"View"}
                    vote={voteForProject}
                    hasVoted={hasVoted}
                    voteCount={project.votes}
                    isVote={addressVote === project.id}
                  />
                </Box>
              );
            })
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Spinner />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProjectsPage;
