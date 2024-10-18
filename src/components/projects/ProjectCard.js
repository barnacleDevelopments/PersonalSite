/** @jsx jsx */
import { jsx } from "theme-ui";

// Components
import { Card, Text, Button, Flex, Box, Link, Heading } from "theme-ui";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";

// markup
const ProjectCard = ({
  id,
  title,
  content,
  siteLink,
  buttonText,
  vote,
  hasVoted,
  voteCount,
  isVote,
  startDate,
  image,
}) => {
  const walletContext = useContext(WalletContext);

  const isDisabled = () => {
    return hasVoted || !walletContext?.isWalletConnected;
  };

  return (
    <Card
      variant="primary"
      sx={{
        color: "white",
        height: "max-content",
        border: isVote ? "3px solid orange" : "none",
        position: "relative",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "primary",
      }}
    >
      {isVote && (
        <Box
          sx={{
            position: "absolute",
            top: "0px",
            right: "0px",
            bg: "orange",
            color: "white",
            p: 2,
            fontSize: "10px",
            zIndex: "1",
          }}
        >
          <Text
            variant="small"
            sx={{
              fontWeight: "bold",
            }}
          >
            Your Vote
          </Text>
        </Box>
      )}
      <Flex
        sx={{
          bg: "primary",
          width: "100%",
          p: 3,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: [
            "column-reverse",
            "column-reverse",
            "column-reverse",
            "row",
          ],
        }}
      >
        <Box
          sx={{
            height: "100%",
            padding: [1, 2, 3],
            width: "100%",
          }}
        >
          <Heading
            as="h2"
            variant="subheading1"
            color="white"
            sx={{
              overflowWrap: "anywhere",
              mt: [3, 3, 3, 1.5],
              mb: [1.5],
            }}
          >
            {title}
          </Heading>
          <Text sx={{ fontSize: 3, fontWeight: "bold" }}></Text>
          <a href={"https://viewblock.io/arweave/tx/" + id}>{id}</a>
          <Text variant="regular" sx={{ color: "white" }}>
            {startDate}
          </Text>
          <Text variant="regular" sx={{ color: "white" }}>
            {voteCount} Vote{voteCount > 1 && "s"}
          </Text>
          {content && (
            <Text variant="regular" sx={{ color: "white" }}>
              {content}
            </Text>
          )}
          <Box>
            <Link href={siteLink}>
              <Button
                variant="secondary"
                sx={{ mt: 3 }}
                className="secondary-btn"
              >
                {buttonText}
              </Button>
            </Link>
            {!isDisabled() && (
              <Button
                disabled={isDisabled()}
                variant={isDisabled() ? "disabled" : "secondary"}
                sx={{ mt: 3, ml: 3 }}
                className="secondary-btn"
                onClick={() => vote(id)}
              >
                Vote
              </Button>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            maxWidth: "400px",
            maxHeight: "200px",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <img sx={{ width: "100%", display: "block" }} src={image} />
        </Box>
      </Flex>
    </Card>
  );
};

export default ProjectCard;
