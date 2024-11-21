/** @jsx jsx */
import { Link, Paragraph, jsx } from "theme-ui";

// COMPONENTS
import { Box, Heading, Grid } from "theme-ui";
import Seo from "../components/app/Seo";
import { StaticImage } from "gatsby-plugin-image";
import CallToAction from "../components/CallToAction";

const AboutPage = () => {
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
        <Grid gap={3} columns={["1fr", "1fr 1fr", "1.5fr 2fr"]}>
          <Box
            sx={{
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <StaticImage
              style={{ height: "500px" }}
              src="../images/devin_portrait_2.jpg"
              alt="dev portrait"
            />
          </Box>
          <Box>
            <Paragraph variant="regular">
              The thing that separates the software field from others is the
              incredible people I have met and the amazing teams they have
              built. Our field encompasses many disciplines, and it is inspiring
              how we can successfully co-operate to achieve extraordinary
              outcomes. I have a passion for helping businesses realize their
              software solutions using the latest web technologies. The
              challenge of technology and its potential to enable new
              possibilities draws me into this ever-expanding field. Whether
              building a solution, gaining deep knowledge on a subject, or
              increasing my proficiency, I am constantly learning. If you
              couldn't tell, I like to climb just about anything I can get my
              hands on. Naturally, if you don't see me at the office, I'm
              probably at the local bouldering gym. Hearing people talk about
              their passions fires me up. Please{" "}
              <Link href="/contact">reach out</Link>; I'm always up for a chat!
            </Paragraph>
          </Box>
        </Grid>
        <CallToAction
          title={"Checkout Some of my Projects"}
          content={"Every project I take on take ownership of."}
          buttonText={"Let's Go!"}
          pageLink={"/projects"}
        />
      </Box>
    </Box>
  );
};

export default AboutPage;
