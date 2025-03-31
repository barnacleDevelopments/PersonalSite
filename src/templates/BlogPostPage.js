/** @jsx jsx */
import React from "react";
import { Button, jsx, Link } from "theme-ui";
import { Heading, Box, Flex, Text } from "theme-ui";
import { graphql } from "gatsby";
import { DateTime } from "luxon";
import { MDXProvider } from "@mdx-js/react";

// COMPONENTS
import { useEffect } from "react";
import Prism from "prismjs";
import Seo from "../components/Seo/Seo";

function HorizontalImages({ children }) {
  const imageComponents = children.filter((x) => x.type == "span");
  return (
    <Flex sx={{ gap: 3 }}>
      {imageComponents.map((x, index) => (
        <Box key={index} sx={{ flex: 1 }}>
          {x}
        </Box>
      ))}
    </Flex>
  );
}

const shortCodes = { HorizontalImages };
const BlogPostPage = ({ data, children }) => {
  const { mdx: node } = data;

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Box>
      <Seo
        title={`Post - ${node.frontmatter.title}`}
        keywords={node.frontmatter?.keywords.split(",")}
        description={node.excerpt}
        image={node.frontmatter.thumbnail?.childImageSharp.original.src}
      ></Seo>
      <Flex
        sx={{
          width: ["100%"],
          m: "0 auto !important",
          pt: 5,
          minHeight: "300px",
          flexDirection: "column",
          bg: "primary",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          px: 2,
          pb: 3,
        }}
      >
        <Heading
          as="h1"
          variant="hero"
          sx={{ wordWrap: "wrap", textAlign: "center", mb: 3, color: "white" }}
        >
          {node.frontmatter.title}
        </Heading>
        <Text variant="regular" sx={{ color: "white" }}>
          {DateTime.fromISO(node.frontmatter.date).toFormat("MMM d, yyyy")}
        </Text>
      </Flex>
      <Box
        sx={{
          margin: "0 auto",
          marginBottom: 5,
          width: ["90%", "80%", "70%"],
        }}
      >
        <MDXProvider components={shortCodes}>{children}</MDXProvider>
        <Box sx={{ textAlign: "center" }}>
          <Link href="/blog">
            <Button>Read More Articles</Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export const pageQuery = graphql`
  query PostsByTitle($slug: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }
    mdx(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date
        keywords
        thumbnail {
          childImageSharp {
            original {
              src
            }
          }
        }
      }
      excerpt(pruneLength: 70)
    }
  }
`;

export default BlogPostPage;
