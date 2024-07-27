/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import PostCard from "../components/blog/PostCard";
import { Heading, Box, Text, Grid, Link, Button } from "theme-ui";
import Seo from "../components/app/Seo";

const CategoryPage = ({ data }) => {
  const pageData = data.allMarkdownRemark.edges;
  const postCategory = pageData[0]?.node.frontmatter.category;
  return (
    <Box>
      <Seo title={postCategory} />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          my: 6,
        }}
      >
        <Box sx={{ mt: 6, mb: 5 }}>
          <Heading as="h1" variant="hero">
            {postCategory
              .split("-")
              .map(
                (w) =>
                  w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() + " ",
              )}
            Posts
          </Heading>
          <Text variant="large" sx={{ textAlign: "center" }}></Text>
        </Box>
        <Grid
          sx={{
            mb: 6,
          }}
          gap={3}
          columns={[1]}
        >
          {pageData.length > 0 ? (
            pageData.map(({ node }, index) => {
              const post = node.frontmatter;
              const postContent = node.html;
              post.slug = node.fields.slug;
              return (
                <PostCard key={index} post={post} postContent={postContent} />
              );
            })
          ) : (
            <Box sx={{ height: "80vh" }}>
              <h1 sx={{ mb: 3 }}>Nothing here for now... check in later!</h1>
              <Link href="/blog">
                <Button>Go Back</Button>
              </Link>
            </Box>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default CategoryPage;

export const pageQuery = graphql`
  query PostsByCategoryQuery($category: String!) {
    allMarkdownRemark(
      filter: {
        frontmatter: { draft: { eq: false }, category: { eq: $category } }
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
            category
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
