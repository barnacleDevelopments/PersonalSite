/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import PostCard from "../components/cards/PostCard";
import Layout from "../components/app/Layout";
import { Box, Text, Themed, Grid } from "theme-ui";
import Seo from "../components/app/Seo";

const ProgrammingPostsPage = ({ data }) => {
  const pageData = data.allMarkdownRemark.edges;
  return (
    <Box>
      <Seo title="Blog" />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          my: 6,
        }}
      >
        <Box sx={{ mt: 6, mb: 5 }} textAlign="center">
          <Themed.h1
            sx={{
              mb: 3,
              color: "primary",
            }}
          >
            Blog Posts
          </Themed.h1>
          <Text variant="large" sx={{ textAlign: "center" }}>
            Looking to learn more about web development? Here I post content
            about various web related topics.
          </Text>
        </Box>
        <Grid
          sx={{
            mb: 6,
          }}
          gap={3}
          columns={[1]}
        >
          {pageData.map(({ node }, index) => {
            const post = node.frontmatter;
            post.slug = node.fields.slug;
            return <PostCard key={index} post={post} />;
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProgrammingPostsPage;

export const landingPageQuery = graphql`
  query ProgrammingPostsPageQuery {
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: "//blog//" } }) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            content
            date
            thumnail {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
    }
  }
`;
