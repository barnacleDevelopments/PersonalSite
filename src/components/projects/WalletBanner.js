/** @jsx jsx */
import { jsx } from "theme-ui";
import React from "react";
import scrollTo from "gatsby-plugin-smoothscroll";

// Components
import { Themed, Text, Button, Box, Link, Flex } from "theme-ui";
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
            <Themed.h2 sx={{ color: "white" }}>Connect Wallet & Vote</Themed.h2>
          ) : (
            <Themed.h2 sx={{ color: "white" }}>
              Your wallet is connected
            </Themed.h2>
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
            <Text variant="regular" sx={{ mt: 3, color: "white" }}>
              Ready to vote? Select your favorite project and confirm the
              transaction via MetaMask. Please be patient as processing may take
              a few minutes. Once the threshold has been reached, a winner will
              randomly be selected and the balance of the contract will be sent
              to their wallet. Your vote will be recorded on the Ethereum
              blockchain via the Sepolia Test Network.
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
