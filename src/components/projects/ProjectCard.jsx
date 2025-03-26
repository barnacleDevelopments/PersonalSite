/** @jsx jsx */
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { jsx } from "theme-ui";

// Components
import { Card, Text, Button, Flex, Box, Link, Heading } from "theme-ui";
import { TechListing } from "./TechListing";

// markup
const ProjectCard = ({ project }) => {
  return (
    <Card
      variant="primary"
      sx={{
        color: "white",
        height: "max-content",
        position: "relative",
        borderRadius: "10px",
        overflow: "hidden",
        backgroundColor: "primary",
        mb: 3,
      }}
    >
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
          <Box sx={{ mb: 2 }}>
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
              {project.title}
            </Heading>
            <Text variant="regular" sx={{ color: "white" }}>
              {project.startDate}
            </Text>
            {project.exerpt && (
              <Text variant="regular" sx={{ color: "white" }}>
                {project.exerpt}
              </Text>
            )}
          </Box>
          <TechListing
            technologies={project.technologies}
            descriptive={false}
          />
          <Box>
            <Link href={project.slug}>
              <Button
                variant="secondary"
                sx={{ mt: 3 }}
                className="secondary-btn"
              >
                View
              </Button>
            </Link>
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
          <GatsbyImage
            placeholder="blurred"
            image={getImage(project.image1)}
            alt={"image 1"}
          />
        </Box>
      </Flex>
    </Card>
  );
};

export default ProjectCard;
