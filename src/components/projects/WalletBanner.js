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
              Your have now connected your wallet to my site! This gives you the
              ability interact with the project voting <ContractLink /> deployed
              on the Sepolia test network. To participate in the voting process,
              first enter a display name, then enter the amount you'd like to
              add to the prize pool, then press "vote" on your favorite project.
              You will be prompted to confirm the transaction via MetaMask.
              Please be patient as processing may take a few minutes. Once the
              threshold has been reached, a winner will randomly be selected and
              the prize balance will be sent to their wallet (the balance of the
              contract after threshold has been reached or exceeded).
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
