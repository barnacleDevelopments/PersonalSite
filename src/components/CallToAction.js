/** @jsx jsx */
import { jsx } from "theme-ui";

// Components
import { Heading, Text, Button, Box, Link, Flex } from "theme-ui";

const CallToAction = ({ title, content, buttonText, pageLink }) => {
  return (
    <Flex
      sx={{
        textAlign: "center",
        flexDirection: "column",
        justifyContent: "center",
        my: [5],
        px: [0, 3],
        bg: "primary",
        color: "white",
        p: 4,
        borderRadius: "10px",
      }}
    >
      <Heading as="h2" variant="subheading1" color="white">
        {title}
      </Heading>
      <Text variant="regular" sx={{ color: "white" }}>
        {content}
      </Text>
      <Box sx={{ mt: 4 }}>
        <Link href={pageLink}>
          <Button variant="primary">{buttonText}</Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default CallToAction;
