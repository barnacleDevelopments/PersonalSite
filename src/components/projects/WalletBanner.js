/** @jsx jsx */
import { Paragraph, jsx } from "theme-ui";
import scrollTo from "gatsby-plugin-smoothscroll";

// Components
import { Text, Button, Box, Link, Flex, Heading } from "theme-ui";
import MetaMask from "../../images/meta-mask.svg";

const WalletBanner = ({
  isWalletConnected,
  walletAddress,
  project,
  onConnectClick,
  hasVoted,
}) => {
  const truncateAddress = (address) => {
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  function ContractLink() {
    return (
      <a
        href={`https://sepolia.etherscan.io/address/${process.env.GATSBY_PROJECT_VOTING_CONTRACT_ADDRESS}`}
        target="_blank"
      >
        smart contract
      </a>
    );
  }

  return (
    <Box
      as="section"
      p={4}
      mt={4}
      sx={{
        backgroundColor: !isWalletConnected ? "primary" : "orange",
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
          {!isWalletConnected ? (
            <Heading as="h2" variant="subheading1" sx={{ color: "white" }}>
              Connect Wallet & Vote
            </Heading>
          ) : (
            <Heading as="h2" variant="subheading1" sx={{ color: "white" }}>
              Your wallet is connected
            </Heading>
          )}
          {/* body */}
          {!isWalletConnected ? (
            <Text variant="regular" sx={{ mt: 3, color: "white" }}>
              Join the Web3 revolution! Connect your Ethereum wallet, like{" "}
              <Link target="_blank" href="https://metamask.io">
                MetaMask
              </Link>{" "}
              and connect to the Sepolia test network to begin providing
              feedback. Your feedback will be secure and tamper-proof, thanks to
              blockchain technology.
            </Text>
          ) : hasVoted ? (
            <Text
              variant="small"
              sx={{
                color: "white",
              }}
            >
              You've already cast your feedback for{" "}
              <a onClick={() => scrollTo(`#id${project?.id}`)}>
                {project?.title}
              </a>
              . Thank you for participating!
            </Text>
          ) : (
            <Paragraph variant="regular" sx={{ mt: 3, color: "white" }}>
              You've successfully connected your wallet! This gives you the
              ability to provide feedback on my projects through a decentralized
              feedback system, using <ContractLink /> deployed on the Sepolia
              test network. To participate, first enter a display name, then
              provide the feedback you'd like to submit. Once you're ready,
              press "Submit Feedback," and you'll be prompted to confirm the
              transaction via MetaMask. Pay your gas fees and I'll soon receive
              your feedback!
            </Paragraph>
          )}
          <Box mt={3} sx={{ color: "white" }}>
            {walletAddress ? (
              <Text variant="regular" color="white">
                {`Connected as ${truncateAddress(walletAddress)}`}
              </Text>
            ) : (
              <Button
                disabled={true}
                title={
                  "Wallet is currently disabled due to project update. Come back later!"
                }
                sx={{ display: "flex", alignItems: "center" }}
                onClick={() => onConnectClick()}
              >
                <Box mr={3}>Connect</Box> <MetaMask width="25px" />{" "}
              </Button>
            )}
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default WalletBanner;
