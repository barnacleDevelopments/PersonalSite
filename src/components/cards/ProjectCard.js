/** @jsx jsx */
import { jsx } from "theme-ui";
import { GatsbyImage } from "gatsby-plugin-image";
import { getImage } from "gatsby-plugin-image";

// Components
import { Themed, Card, Text, Button, Flex, Box } from "theme-ui";
import { useContext } from "react";
import { WalletContext } from "../../contexts/WalletContext";

// markup
const ProjectCard = ({
  id,
  image,
  title,
  content,
  siteLink,
  buttonText,
  vote,
  hasVoted,
  voteCount,
  isVote,
}) => {
  const cardImage = getImage(image);
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
      {image && (
        <GatsbyImage
          style={{ height: "200px" }}
          imgStyle={{ objectFit: "cover" }}
          placeholder="blurred"
          crossOrigin="anonymous"
          image={cardImage}
          alt={title}
        />
      )}
      <Flex
        sx={{
          bg: "primary",
          width: "100%",
          p: 3,
          flexDirection: "column",
        }}
      >
        <Themed.h3
          sx={{
            whiteSpace: "nowrap",
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            mb: 3,
          }}
        >
          {title}
        </Themed.h3>
        <Text variant="regular" sx={{ color: "white" }}>
          {voteCount} Vote{voteCount > 1 && "s"}
        </Text>
        {content && (
          <Text variant="regular" sx={{ color: "white" }}>
            {content}
          </Text>
        )}
        <Box>
          <a href={siteLink}>
            <Button
              variant="secondary"
              sx={{ mt: 3 }}
              className="secondary-btn"
            >
              {buttonText}
            </Button>
          </a>
          <Button
            disabled={isDisabled()}
            variant={isDisabled() ? "disabled" : "secondary"}
            sx={{ mt: 3 }}
            className="secondary-btn"
            onClick={() => vote(id)}
          >
            Vote
          </Button>
        </Box>
      </Flex>
    </Card>
  );
};

export default ProjectCard;
