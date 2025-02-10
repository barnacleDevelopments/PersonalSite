/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import PostCard from "../components/blog/PostCard";
import { Box, Text, Grid, Heading } from "theme-ui";
import Seo from "../components/app/Seo";

const AllPostsPage = ({ data }) => {
  const pageData = data.allMdx.edges;
  return (
    <Box>
      <Seo title="Blog"></Seo>
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          my: 6,
        }}
      >
        <Box sx={{ mt: 6, mb: 5 }}>
          <Heading as="h1" variant="hero">
            Blog Posts
          </Heading>
          <Text variant="large">
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
            const excerpt = node.excerpt;
            post.slug = node.fields.slug;
            return <PostCard key={index} post={post} postContent={excerpt} />;
          })}
        </Grid>
      </Box>
    </Box>
  );
};

export default AllPostsPage;

//excerpt(truncate: true, format: HTML, pruneLength: 100)
export const programmingPostsPageQuery = graphql`
  query ProgrammingPostsPageQuery {
    allMdx(
      filter: { frontmatter: { draft: { eq: false } } }
      sort: { frontmatter: { date: DESC } }
      filter: { internal: { contentFilePath: { regex: "/content/posts/" } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM, YYYY")
            thumbnail {
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
