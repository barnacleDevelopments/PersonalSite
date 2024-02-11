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

  return (
    <Box
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
              and connect to the Sepolia test network to begin voting. Your vote
              will be secure and tamper-proof, thanks to blockchain technology.
            </Text>
          ) : hasVoted ? (
            <Text
              variant="small"
              sx={{
                color: "white",
              }}
            >
              You've already cast your vote for{" "}
              <a onClick={() => scrollTo(`#id${project?.id}`)}>
                {project?.title}
              </a>
              . Thank you for participating!
            </Text>
          ) : (
            <Paragraph variant="regular" sx={{ mt: 3, color: "white" }}>
              Ready to vote? Select your favorite project and confirm the
              transaction via MetaMask. Please be patient as processing may take
              a few minutes. Once the threshold has been reached, a winner will
              randomly be selected and the balance of the contract will be sent
              to their wallet. There are a few activites you can perform that
              will help increase your chance of winning. Be sure to check those
              out! Your vote will be recorded on the Ethereum blockchain via the
              Sepolia Test Network.
            </Paragraph>
          )}
          <Box mt={3} sx={{ color: "white" }}>
            {walletAddress ? (
              <Text variant="regular" color="white">
                {`Connected as ${truncateAddress(walletAddress)}`}
              </Text>
            ) : (
              <Button
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
