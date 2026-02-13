import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { Link } from "gatsby";
import { Box, Button, Flex, Grid, Text, Link as ThemeLink } from "theme-ui";

const Footer = () => {
  return (
    <footer>
      <Grid sx={{ bg: "primary", pb: 4 }} columns={[1, null, 3]}>
        <Box sx={{ textAlign: "center" }}>
          <h4 sx={{ mb: 3, color: "white" }}>Contact Me</h4>
          <Text variant="small" sx={{ color: "white" }}>
            Please get in touch.
          </Text>
          <Link to="/contact" sx={{ display: "block", mt: 3 }}>
            <Button variant="secondary">Let's Go!</Button>
          </Link>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <h4 sx={{ mb: 3, color: "white" }}>Media</h4>
          <Flex sx={{ flexDirection: "column", alignItems: "center" }}>
            <ThemeLink
              target="_blank"
              href="https://www.linkedin.com/in/devin-dev-d-63008412b"
              sx={{ mb: 2, width: "max-content", svg: { fontSize: "1.2em" } }}
              variant="footer"
            >
              <Icon icon={faLinkedin} />
              <Text sx={{ color: "white", ml: 1 }} variant="small">
                {" "}
                Linkdin
              </Text>
            </ThemeLink>
            <ThemeLink
              target="_blank"
              href="https://www.instagram.com/devindavis732/"
              sx={{ mb: 2, width: "max-content", svg: { fontSize: "1.2em" } }}
              variant="footer"
            >
              <Icon icon={faInstagram} />
              <Text sx={{ color: "white", ml: 1 }} variant="small">
                {" "}
                Instagram
              </Text>
            </ThemeLink>
          </Flex>
        </Box>
        <Box sx={{ textAlign: "center" }}>
          <h4 sx={{ mb: 3, color: "white" }}>Navigation</h4>
          <Flex as="nav" sx={{ flexDirection: "column", alignItems: "center" }}>
            <Link
              to="/"
              sx={{
                mb: 2,
                width: "max-content",
                color: "white",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Home
            </Link>
            <Link
              to="/contact"
              sx={{
                mb: 2,
                width: "max-content",
                color: "white",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Contact
            </Link>
            <Link
              to="/projects"
              sx={{
                mb: 2,
                width: "max-content",
                color: "white",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Projects
            </Link>
            <Link
              to="/about"
              sx={{
                mb: 2,
                width: "max-content",
                color: "white",
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
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
