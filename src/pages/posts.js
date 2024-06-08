/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import PostCard from "../components/blog/PostCard";
import { Box, Text, Grid, Heading } from "theme-ui";
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
          <Heading as="h1" variant="hero">
            Blog Posts
          </Heading>
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
            const postContent = node.html;
            post.slug = node.fields.slug;
            return (
              <PostCard key={index} post={post} postContent={postContent} />
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default ProgrammingPostsPage;

export const programmingPostsPageQuery = graphql`
  query ProgrammingPostsPageQuery {
    allMarkdownRemark(
      filter: {
        fileAbsolutePath: { regex: "//blog//" }
        frontmatter: { draft: { eq: false } }
      }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
          html
        }
      }
    }
  }
`;
