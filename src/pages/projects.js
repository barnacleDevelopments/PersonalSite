/** @jsx jsx */
import { Link, Paragraph, Progress, jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import ProjectCard from "../components/projects/ProjectCard";
import { Box, Heading, Button, Flex, Text } from "theme-ui";
import Seo from "../components/app/Seo";
import { useContext, useEffect, useState } from "react";
import WalletBanner from "../components/projects/WalletBanner";
import CallToAction from "../components/CallToAction";
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
  const [voteStarted, setVoteStarted] = useState(false);
  const [voteConfirmed, setVoteConfirmed] = useState(false);

  const walletContext = useContext(WalletContext);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const init = async () => {};
      init();
    }
  }, [walletContext?.walletAddress, walletContext?.isWalletConnected]);

  const projects = data.allMarkdownRemark.edges.map(
    ({ node: { fields, frontmatter } }) => ({
      ...fields,
      ...frontmatter,
    }),
  );

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
              provide feedback on a project and you might be rewarded!
            </Paragraph>
            <Heading as="h2" variant="subheading1" sx={{ mt: 4 }}>
              Participate in Web3 Crowd Sourced Feedback
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
            onConnectClick={walletContext?.connectWallet}
          ></WalletBanner>
        </Box>
        <Box
          as="section"
          sx={{
            mb: 3,
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Box>
        <CallToAction
          title={"Interested in collaborating?"}
          content={
            "I'd love to hear from you and explore how we can work together."
          }
          buttonText={"Get in Touch"}
          pageLink={"/contact"}
        />
      </Box>
    </Box>
  );
};

export const projectsQuery = graphql`
  query ProjectsPageQuery {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//projects//" } }
      sort: { frontmatter: { startDate: DESC } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            image1
            description
            startDate(formatString: "MMMM, YYYY")
          }
        }
      }
    }
  }
`;

export default ProjectsPage;
