/** @jsx jsx */
import { Link, Paragraph, jsx } from "theme-ui";

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
          The thing that separates the software field from others is the
          incredible people I have met and the amazing teams they have built.
          Our field encompasses many disciplines, and it is inspiring how we can
          successfully collaborate to achieve extraordinary outcomes. I have a
          passion for helping businesses realize their software solutions using
          the latest web technologies. The challenge of technology and its
          potential to enable new possibilities draws me into this
          ever-expanding field. Whether building a solution, gaining deep
          knowledge on a subject, or increasing my proficiency, I am constantly
          learning. Outside of the office, I am an avid boulderer (a type of
          climbing) who currently lives in the beautiful city of Montreal. I
          love talking to new people about technology and learning about their
          projects. Please <Link href="/contact">reach out</Link>; I'm always up
          for a chat!
        </Paragraph>
      </Box>
    </Box>
  );
};

export default ServicesPage;
