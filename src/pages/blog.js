/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";
// Components
import { Box, Text, Grid, Heading } from "theme-ui";
import Seo from "../components/app/Seo";
import PostCategoryCard from "../components/blog/PostCategoryCard";

const BlogPage = ({ data }) => {
  const categories = data.allMarkdownRemark.distinct;
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
        <Box sx={{ mt: 6, mb: 5 }}>
          <Heading as="h1" variant="hero">
            Blog
          </Heading>
          <Text variant="large">
            I'm on a lifelong journey of learning and I love to share what I
            learn with others. When I get the chance I like to write about what
            I'm learning. This is an archive of my blog posts. Feel free to take
            a gander!
          </Text>
        </Box>
        <Grid
          sx={{
            mb: 3,
          }}
          gap={3}
          columns={[1, 2]}
        >
          {categories.map((category) => (
            <PostCategoryCard
              key={category}
              title={category.split("-").map((w) => {
                return w.charAt(0).toUpperCase() + w.slice(1) + " ";
              })}
              link={category}
            />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export const pageQuery = graphql`
  query BlogPageQuery {
    allMarkdownRemark(filter: { frontmatter: { draft: { eq: false } } }) {
      distinct(field: { frontmatter: { category: SELECT } })
    }
  }
`;

export default BlogPage;
