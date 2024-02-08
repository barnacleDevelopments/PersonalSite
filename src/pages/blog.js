/** @jsx jsx */
import { jsx } from "theme-ui";

// Components
import { Box, Text, Themed, Grid } from "theme-ui";
import Seo from "../components/app/Seo";
import PostCategoryCard from "../components/blog/PostCategoryCard";

const BlogPage = () => {
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
            Blog
          </Themed.h1>
          <Text variant="large">
            I'm on a lifelong journey of learning and I love to share what I
            learn with others. When I get the chance I like to write about what
            I'm learning. This is an archive of my blog posts I have written.
          </Text>
        </Box>
        <Grid
          sx={{
            mb: 6,
          }}
          gap={3}
          columns={[1, 2]}
        >
          <PostCategoryCard
            title="For Developers"
            content="A series of technical posts for web developers."
            link="/blog/programming_blog"
          />
          <PostCategoryCard
            title="For Business"
            content="Some reads to inform buisness owners of the advantages of owning a buisness website."
            link="/blog/web_business_blog"
          />
        </Grid>
      </Box>
    </Box>
  );
};

export default BlogPage;
