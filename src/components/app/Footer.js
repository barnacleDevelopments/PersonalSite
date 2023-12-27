/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Link, Text, Grid, Button, Flex } from "theme-ui";
import { Themed } from "theme-ui";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
  return (
    <footer>
      <Grid sx={{ bg: "primary", pb: 4 }} columns={[1, null, 3]}>
        <Box sx={{ textAlign: "center" }}>
          <Themed.h4 sx={{ mb: 3, color: "white" }}>Contact Me</Themed.h4>
          <Text variant="small" sx={{ color: "white" }}>
            Please get in touch.
          </Text>
          <Link sx={{ display: "block", mt: 3 }} href="/contact">
            <Button variant="secondary">Let's Go!</Button>
          </Link>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Themed.h4 sx={{ mb: 3, color: "white" }}>Media</Themed.h4>
          <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
            <Link
              href="https://www.linkedin.com/in/devin-dev-d-63008412b"
              sx={{ mb: 2, width: "max-content", svg: { fontSize: "1.2em" } }}
              variant="footLink"
            >
              <Icon icon={faLinkedin} />
              <Text sx={{ color: "white", ml: 1 }} variant="small">
                {" "}
                Linkdin
              </Text>
            </Link>
          </Flex>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <Themed.h4 sx={{ mb: 3, color: "white" }}>Navigation</Themed.h4>
          <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
            <Link
              sx={{ mb: 2, width: "max-content" }}
              variant="footLink"
              href="/"
            >
              Home
            </Link>
            <Link
              sx={{ mb: 2, width: "max-content" }}
              variant="footLink"
              href="/contact"
            >
              Contact
            </Link>
            <Link
              sx={{ mb: 2, width: "max-content" }}
              variant="footLink"
              href="/projects"
            >
              Projects
            </Link>
            <Link
              sx={{ mb: 2, width: "max-content" }}
              variant="footLink"
              href="/services"
            >
              About
            </Link>
          </Flex>
        </Box>
      </Grid>
    </footer>
  );
};

export default Footer;
