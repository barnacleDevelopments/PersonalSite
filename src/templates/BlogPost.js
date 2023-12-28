/** @jsx jsx */
import { jsx } from "theme-ui";
import { Themed, Box, Flex, Text } from "theme-ui";
import { graphql } from "gatsby";
import showdown from "showdown";
import moment from "moment";

// COMPONENTS
import Layout from "../components/app/Layout";
import Seo from "../components/app/Seo";
import { useEffect } from "react";
import Prism from "prismjs";

// markup
const BlogPost = ({ data }) => {
  const { markdownRemark: node } = data;
  const converter = new showdown.Converter();

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <Layout>
      <Seo
        title={`Post - ${node.frontmatter.title}`}
        keywords={node.frontmatter?.keywords.split(",")}
        image={node.frontmatter?.thumnail}
      />
      <Flex
        sx={{
          width: ["100%"],
          m: "0 auto !important",
          pt: 5,
          height: "300px",
          flexDirection: "column",
          bg: "primary",
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          textAlign: "center",
          px: 2,
        }}
      >
        <Themed.h1 sx={{ wordWrap: "wrap", textAlign: "center", mb: 3 }}>
          {node.frontmatter.title}
        </Themed.h1>
        <Text variant="regular" sx={{ color: "white" }}>
          {moment(node.frontmatter.date).format("MMM Do, YYYY")}
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
            ul: { marginLeft: "40px" },
            li: { listStyleType: "dot" },
            blockquote: { fontStyle: "italic" },
            a: { color: "orange" },
          }}
          variant="small"
          dangerouslySetInnerHTML={{
            __html: converter.makeHtml(node.frontmatter.content),
          }}
        ></Text>
      </Box>
    </Layout>
  );
};

export const pageQuery = graphql`
  query PostsByTitle($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date
        content
        keywords
        thumnail {
          absolutePath
        }
      }
    }
  }
`;

export default BlogPost;
