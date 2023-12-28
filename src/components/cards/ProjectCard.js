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
  voteForProject,
  hasVoted,
  voteCount,
}) => {
  const cardImage = getImage(image);
  const { isWalletConnected } = useContext(WalletContext);

  const isDisabled = () => {
    return hasVoted || !isWalletConnected;
  };

  return (
    <Card
      variant="primary"
      sx={{
        color: "white",
        height: "max-content",
      }}
    >
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
          Votes: {voteCount}
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
            onClick={() => voteForProject(id)}
          >
            Vote
          </Button>
        </Box>
      </Flex>
    </Card>
  );
};

export default ProjectCard;
