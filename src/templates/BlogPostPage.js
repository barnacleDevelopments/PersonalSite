/** @jsx jsx */
import { Button, jsx, Link } from "theme-ui";
import { Heading, Box, Flex, Text } from "theme-ui";
import { graphql } from "gatsby";
import showdown from "showdown";
import moment from "moment";

// COMPONENTS
import Seo from "../components/app/Seo";
import { useEffect } from "react";
import Prism from "prismjs";

// markup
const BlogPostPage = ({ data }) => {
  const { markdownRemark: node } = data;
  const converter = new showdown.Converter();

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Box>
      <Seo
        title={`Post - ${node.frontmatter.title}`}
        keywords={node.frontmatter?.keywords.split(",")}
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
          {moment(node.frontmatter.date).format("MMM Do, YYYY")}
        </Text>
        <Text variant="regular" sx={{ color: "white" }}>
          {node.timeToRead} minutes
        </Text>
      </Flex>
      <Box
        sx={{
          margin: "0 auto",
          marginBottom: 5,
          width: ["90%", "80%", "70%"],
        }}
      >
        <Text
          sx={{
            "h1, h2, h3": { fontWeight: 500 },
            h1: { fontSize: "2.2em" },
            h2: { fontSize: "2em" },
            h3: { fontSize: "1.5em", fontStyle: "italic" },
            ul: { marginLeft: "40px", overflowWrap: "break-word" },
            ol: { marginLeft: "40px", overflowWrap: "break-word" },
            li: { listStyleType: "dot" },
            blockquote: { fontStyle: "italic" },
            a: { color: "orange" },
          }}
          variant="small"
          dangerouslySetInnerHTML={{
            __html: converter.makeHtml(node.html),
          }}
        ></Text>
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
        siteUrl: url
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
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
      excerpt(truncate: true, format: PLAIN, pruneLength: 70)
      html
      timeToRead
    }
  }
`;

export default BlogPostPage;
