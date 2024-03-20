/** @jsx jsx */
import { Paragraph, jsx } from "theme-ui";

// COMPONENTS
import { Box, Text, Grid, Heading, Button, Link } from "theme-ui";
import Seo from "../components/app/Seo";
import ServiceCard from "../components/cards/ServiceCard";
import { StaticImage } from "gatsby-plugin-image";
import BubbleCanvas from "../components/BubbleCanvas";

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
        <Heading
          as="h2"
          variant="subheading1"
          sx={{
            mb: 3,
            mt: 4,
            color: "primary",
          }}
        >
          Services
        </Heading>
        <Text variant="regular">
          Though I dedicate the grand magority of my time to the specific
          organization I work with I can take on the occasional freelance
          project. Get an estimate by selecting a project type bellow or{" "}
          <a href="/contact">send me an email!</a>
        </Text>
        <br />
        <Text variant="regular">
          If the project is a website I often work closely with my friend and
          designer{" "}
          <a href="https://www.linkedin.com/in/paul-legere">Paul Legere</a>.
          Please check out his work!
        </Text>
        <Grid sx={{ mt: 4 }} gap={3} columns={[1, null, 2]}>
          <ServiceCard
            title="Basic 5 Page Site"
            features={[
              "SEO Optimization",
              "Custom Styling and Layout",
              "Smartphone and Tablet Ready",
              "One Language",
            ]}
            startPrice={1500}
          />
          <Box
            sx={{
              textAlign: ["center"],
            }}
          >
            <Box
              sx={{
                bg: "primary",
                color: "white",
                px: 3,
                py: 4,
                borderRadius: "10px",
              }}
            >
              <Box>
                <Heading as="h2" variant="subheading1" color="white">
                  Something Else?
                </Heading>
              </Box>
              <Box>
                <Text
                  variant="regular"
                  sx={{ color: "white", fontWeight: 300 }}
                >
                  Sometimes businesses need something more feature rich. If you
                  have an idea please reach out! I'd love to work with you.
                </Text>
              </Box>
              <Box>
                <Link href="/contact">
                  <Button variant="secondary" sx={{ mt: 4 }}>
                    Contact Me
                  </Button>
                </Link>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
};

export default ServicesPage;
