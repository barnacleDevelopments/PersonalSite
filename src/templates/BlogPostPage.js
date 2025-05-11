/** @jsx jsx */
import { MDXProvider } from "@mdx-js/react";
import { graphql } from "gatsby";
import { DateTime } from "luxon";
import PropTypes from "prop-types";
import { Button, jsx, Link, Heading, Box, Flex, Text } from "theme-ui";

import Seo from "../components/Seo/Seo";
import globalCodes from "../short-codes";

function HorizontalImages({ children }) {
  const imageComponents = children.filter((x) => x.type === "span");
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

HorizontalImages.propTypes = {
  children: PropTypes.array.isRequired,
};

const shortCodes = {...globalCodes, HorizontalImages };

const BlogPostPage = ({ data, children }) => {
  const { mdx: node } = data;

  return (
    <Box>
      <Seo
        title={`Post - ${node.frontmatter.title}`}
        keywords={node.frontmatter.keywords.split(",")}
        description={node.excerpt}
        image={node.frontmatter.thumbnail.childImageSharp.original.src}
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

BlogPostPage.propTypes = {
  data: PropTypes.shape({
    mdx: PropTypes.shape({
      frontmatter: PropTypes.shape({
        title: PropTypes.string.isRequired,
        date: PropTypes.string.isRequired,
        keywords: PropTypes.string,
        thumbnail: PropTypes.shape({
          childImageSharp: PropTypes.shape({
            original: PropTypes.shape({
              src: PropTypes.string.isRequired,
            }),
          }),
        }),
      }).isRequired,
      excerpt: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  children: PropTypes.node.isRequired,
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
