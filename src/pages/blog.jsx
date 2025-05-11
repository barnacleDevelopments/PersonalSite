/** @jsx jsx */
import { faRssSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { graphql } from "gatsby";
import { jsx , Box, Flex, Text, Grid, Heading } from "theme-ui";

import PostCategoryCard from "../components/PostCategoryCard/PostCategoryCard";
import Seo from "../components/Seo/Seo";


const dailyDevUrl = "https://app.daily.dev/devdeveloper";
const dailyDevImgUrl =
  "https://api.daily.dev/devcards/v2/cXKKpBu9O.png?type=default&r=6yz";

const BlogPage = ({ data }) => {
  const categories = data.allMdx.distinct;

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
        <Flex sx={{ mt: 6, mb: 5 }}>
          <Box>
            <Heading as="h1" variant="hero">
              Blog
            </Heading>
            <Text variant="large">
              I'm on a lifelong journey of learning and I love to share what I
              learn with others. When I get the chance I like to write about
              what I'm learning. This is an archive of my blog posts. Feel free
              to take a gander!
            </Text>
            <Box
              sx={{
                mt: 3,
                backgroundColor: "primary",
                width: "min-content",
                borderRadius: 5,
                padding: 2,
              }}
            >
              <a target="_blanc" href="/rss.xml">
                <Icon
                  icon={faRssSquare}
                  size="2x"
                  sx={{
                    color: "orange",
                  }}
                />
              </a>
            </Box>
          </Box>
          <a sx={{ display: ["none", "block"] }} href={dailyDevUrl}>
            <img src={dailyDevImgUrl} width="250" alt="Devin's Dev Card" />
          </a>
        </Flex>
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
    site {
      siteMetadata {
        siteUrl
      }
    }
    allMdx(filter: { frontmatter: { draft: { eq: false } } }) {
      distinct(field: { frontmatter: { category: SELECT } })
    }
  }
`;

export default BlogPage;
