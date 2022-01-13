/** @jsx jsx */
import { jsx } from "theme-ui";

// Components
import { Flex, Themed, Text, Button, Link } from "theme-ui";

function PostCategoryCard({ title, content, link }) {
  return (
    <Flex sx={{ bg: "primary", color: "white", p: 4, alignItems: "center", flexDirection: "column", textAlign: "center" }} >
      <Themed.h2 sx={{ mb: 3 }}>{title}</Themed.h2>
      <Text variant="regular" sx={{ color: "white", mb: 4 }}>{content}</Text>
      <Link href={link} sx={{ textDecoration: "none", color: "white" }}><Button sx={{ display: "block" }}>Read</Button></Link>
    </Flex>
  )
}

export default PostCategoryCard;