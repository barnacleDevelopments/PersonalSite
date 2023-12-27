/** @jsx jsx */
import { jsx } from "theme-ui";
import { GatsbyImage } from "gatsby-plugin-image";
import { getImage } from "gatsby-plugin-image";
import Web3 from "web3";
import projectVotingABI from "../../../backend/build/contracts/ProjectVoting.json";

// Components
import { Themed, Card, Text, Button, Flex, Box } from "theme-ui";
import { useEffect, useState } from "react";

// markup
const ProjectCard = ({ image, title, content, siteLink, buttonText }) => {
  const cardImage = getImage(image);
  const [voteCount, setVoteCount] = useState();

  useEffect(() => {
    const web3 = new Web3(Web3.givenProvider || "http://localhost:9545");
    const contractAddress = "0x9F88CbE3f79F1a2780ede54480A2e5EfbB73c135";
    const contract = new web3.eth.Contract(
      projectVotingABI.abi,
      contractAddress
    );
    contract.methods
      .getVoteCount(0)
      .call()
      .then((x) => {
        setVoteCount(x.toString());
      });
  }, []);

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
        </Box>
      </Flex>
    </Card>
  );
};

export default ProjectCard;
