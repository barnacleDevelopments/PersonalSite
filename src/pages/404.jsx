import { Link } from "gatsby";
import { Box, Button, Flex, Heading, Text } from "theme-ui";

import Seo from "../components/Seo/Seo";

const NotFoundPage = () => {
  return (
    <Box>
      <Seo title="Page Not Found | Dev the Developer" />
      <Box
        sx={{
          bg: "primary",
          pt: 5,
          pb: 5,
          width: "100%",
        }}
      >
        <Flex
          sx={{
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: ["90%", "80%", "70%"],
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <Text
            sx={{
              fontSize: ["6rem", "8rem", "10rem"],
              fontWeight: "bold",
              color: "orange",
              lineHeight: 1,
              mb: 3,
            }}
          >
            404
          </Text>
          <Heading as="h1" variant="hero" color="white" sx={{ mb: 0 }}>
            Page Not Found
          </Heading>
        </Flex>
      </Box>
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          pt: 4,
          textAlign: "center",
        }}
      >
        <Text variant="regular" sx={{ maxWidth: "500px", mx: "auto" }}>
          Oops! The page you're looking for doesn't exist or has been moved.
          Let's get you back on track.
        </Text>
        <Flex
          sx={{
            gap: 3,
            justifyContent: "center",
            flexWrap: "wrap",
            mb: 4,
            mt: 4,
          }}
        >
          <Link to="/">
            <Button variant="primary">Go Home</Button>
          </Link>
          <Link to="/blog">
            <Button variant="secondary">Read the Blog</Button>
          </Link>
          <Link to="/contact">
            <Button variant="secondary">Contact Me</Button>
          </Link>
        </Flex>
      </Box>
    </Box>
  );
};

export default NotFoundPage;
