/** @jsx jsx */
import { jsx } from "theme-ui";

// Components
import PostCard from "../components/cards/PostCard";
import Layout from "../components/app/Layout";
import { Box, Text, Themed, Grid } from "theme-ui";
import Seo from "../components/app/Seo";
import PostCategoryCard from "../components/styled/PostCategoryCard";

const BlogPage = () => {

  return (
    <Layout>
      <Seo title="Blog" />
      <Box sx={{
        margin: "0 auto",
        width: ["90%", "80%", "70%"],
        my: 6,
      }}>
        <Box sx={{ mt: 6, mb: 5 }} textAlign="center">
          <Themed.h1 sx={{
            mb: 3,
            color: "primary",
          }}>Blog</Themed.h1>
          <Text variant="large" sx={{ textAlign: "center" }}>Welcome to my blog! Here I write articles on all things web for buisness owners and developers like myself.</Text>
        </Box>
        <Grid sx={{
          mb: 6
        }} gap={3} columns={[1, 2]} >
          <PostCategoryCard
            title="For Developers"
            content="A series of technical posts for web developers."
            link="/blog/programming_blog" />
          <PostCategoryCard
            title="For Business"
            content="Some reads to inform buisness owners of the advantages of owning a buisness website."
            link="/blog/web_business_blog"
          />
        </Grid>
      </Box>
    </Layout >
  )
}

export default BlogPage;