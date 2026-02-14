import { Link as GatsbyLink, graphql } from "gatsby";
import { Box, Button, Grid, Heading, Text } from "theme-ui";

import Layout from "../components/app/Layout";
import PostCard from "../components/PostCard/PostCard";
import Seo from "../components/Seo/Seo";

const CategoryPage = ({ data }) => {
  const pageData = data.allMdx.edges;
  const postCategory = pageData[0]?.node.frontmatter.category;

  return (
    <Layout>
      <Seo
        title={postCategory}
        keywords={[
          "Devin Davis",
          "Category Posts",
          "Web Development Blog",
          `${postCategory} Tutorials`,
          `${postCategory} Insights`,
          `${postCategory} Articles`,
          `Latest ${postCategory} Updates`,
          "Web Developer Blog",
          "Tech Tutorials",
          "Coding Insights",
          "Programming Blog",
          "Web Development News",
          "Innovative Web Solutions",
          "Web Development Tips",
          "Developer Resources",
        ]}
      />
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
                  `${w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()} `,
              )}
            Posts
          </Heading>
          <Text variant="large" sx={{ textAlign: "center" }} />
        </Box>
        <Grid
          sx={{
            mb: 6,
          }}
          gap={3}
          columns={[1]}
        >
          {pageData.length > 0 ? (
            pageData.map(({ node }) => {
              const post = node.frontmatter;
              const excerpt = node.excerpt;
              post.slug = node.fields.slug;
              return (
                <PostCard
                  key={node.fields.slug}
                  post={post}
                  postContent={excerpt}
                />
              );
            })
          ) : (
            <Box sx={{ height: "80vh" }}>
              <h1 sx={{ mb: 3 }}>Nothing here for now... check in later!</h1>
              <GatsbyLink to="/blog">
                <Button>Go Back</Button>
              </GatsbyLink>
            </Box>
          )}
        </Grid>
      </Box>
    </Layout>
  );
};

export default CategoryPage;

export const pageQuery = graphql`
  query PostsByCategoryQuery($category: String!, $language: String!) {
    allMdx(
      filter: {
        frontmatter: { draft: { eq: false }, category: { eq: $category } }
      }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            date(formatString: "MMMM do, YYYY")
            category
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
            }
          }
        }
      }
    }

    locales: allLocale(
      filter: { ns: { in: ["common"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
