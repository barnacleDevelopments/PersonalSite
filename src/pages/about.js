/** @jsx jsx */
import { Paragraph, jsx } from "theme-ui";

// COMPONENTS
import { Box, Heading } from "theme-ui";
import Seo from "../components/app/Seo";
import { StaticImage } from "gatsby-plugin-image";

const ServicesPage = () => {
  const skills = [
    "/assets/angular_icon.png",
    "/assets/react_icon.png",
    "/assets/javascript_logo.png",
    "/assets/net_logo.png",
    "/assets/vue_logo.png",
    "/assets/azure_logo.png",
    "/assets/chat_logo.png",
    "/assets/mssql_logo.png",
    "/assets/git_logo.png",
  ];

  return (
    <Box>
      <Seo title="About" />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          my: 6,
        }}
      >
        <Heading as="h1" variant="hero">
          A Little More About Me
        </Heading>
        <Box
          sx={{
            overflow: "hidden",
            borderRadius: "10px",
            mb: 3,
          }}
        >
          <StaticImage
            style={{ height: "300px" }}
            src="../images/devin_climbing.jpg"
            alt="dev portrait"
          />
        </Box>
        <Paragraph variant="regular">
          I'm a full stack web developer with a passion for helping businesses
          build awesome solutions by using the latest web technologies. I like
          to focus on building simple solutions using the minimal tech stack
          required. My interests currently are in Blockchain technologies and a
          new front-end library called <a href="https://htmx.org/">HTMX</a>.{" "}
          Outside of the office, I'm an avid boulderer who currently lives in
          the beautiful city of Montreal.
        </Paragraph>
      </Box>
    </Box>
  );
};

export default ServicesPage;
