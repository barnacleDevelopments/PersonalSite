/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import PostCard from "../components/blog/PostCard";
import { Box, Text, Themed, Grid, Link, Button } from "theme-ui";
import Seo from "../components/app/Seo";

const CategoryPosts = ({ data }) => {
  const pageData = data.allMarkdownRemark.edges;
  const postCategory = pageData[0]?.node.frontmatter.category;
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
            {postCategory}
          </Themed.h1>
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
              post.slug = node.fields.slug;
              return <PostCard key={index} post={post} />;
            })
          ) : (
            <Box sx={{ height: "80vh" }}>
              <Themed.h1 sx={{ mb: 3 }}>
                Nothing here for now... check in later!
              </Themed.h1>
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

export default CategoryPosts;

export const landingPageQuery = graphql`
  query PostsByCategoryQuery($categoryRegex: String!) {
    allMarkdownRemark(filter: { fileAbsolutePath: { regex: $categoryRegex } }) {
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
