/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";
// Components
import { Box, Text, Grid, Heading } from "theme-ui";
import Seo from "../components/app/Seo";
import PostCategoryCard from "../components/blog/PostCategoryCard";
import PostCard from "../components/blog/PostCard";

const BlogPage = ({ data }) => {
  const categories = data.allMarkdownRemark.distinct;
  const posts = data.allMarkdownRemark.edges
    .filter((_, index) => index < 4)
    .map(({ node }) => ({
      ...node.frontmatter,
      ...node.fields,
      html: node.html,
    }));
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
        <Heading as="h2" variant="hero">
          Recent Posts
        </Heading>
        <Grid
          sx={{
            mb: 6,
            width: "100%",
          }}
          gap={3}
          columns={[1]}
        >
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} postContent={post.html} />
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export const pageQuery = graphql`
  query BlogPageQuery {
    allMarkdownRemark(
      filter: { frontmatter: { draft: { eq: false } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      distinct(field: { frontmatter: { category: SELECT } })
      edges {
        node {
          html
          fields {
            slug
          }
          frontmatter {
            title
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
            }
            date(formatString: "MMMM do, YYYY")
          }
        }
      }
    }
  }
`;

export default BlogPage;
