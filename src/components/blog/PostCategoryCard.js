/** @jsx jsx */
import { jsx } from "theme-ui";

// Components
import { Text, Flex, Button, Link, Heading } from "theme-ui";

function PostCategoryCard({ title, content, link }) {
  return (
    <Flex
      sx={{
        bg: "primary",
        color: "white",
        p: 4,
        alignItems: "center",
        flexDirection: "column",
        textAlign: "center",
      }}
    >
      <Heading as="h2" variant="subheading1" color="white">
        {title}
      </Heading>
      <Text variant="regular" sx={{ color: "white", mb: 4 }}>
        {content}
      </Text>
      <Link href={link} sx={{ textDecoration: "none", color: "white" }}>
        <Button sx={{ display: "block" }}>Read</Button>
      </Link>
    </Flex>
  );
}

export default PostCategoryCard;
