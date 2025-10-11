/** @jsx jsx */
import { graphql, Link as GatsbyLink } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { StaticImage } from "gatsby-plugin-image";
import { jsx, Text, Button, Flex, Box, Grid, Heading } from "theme-ui";

import BookCard from "../components/BookCard/BookCard";
import CallToAction from "../components/CallToAction";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard/PostCard";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Seo from "../components/Seo/Seo";

const IndexPage = ({ data }) => {
  const { t } = useTranslation();

  const posts = data.blogPosts.edges
    .filter((_, index) => index < 4)
    .map(({ node }) => ({
      ...node.frontmatter,
      ...node.fields,
      excerpt: node.excerpt,
    }));

  const books = data.books.edges.map(({ node }) => ({
    ...node.frontmatter,
    ...node.fields,
  }));

  const projects = data.projects.edges.map(({ node }) => ({
    ...node.frontmatter,
    ...node.fields,
  }));

  return (
    <Box>
      <Seo />
      <Box
        sx={{
          bg: "primary",
          pt: 5,
          pb: 5,
          width: "100%",
          textTransform: "uppercase",
        }}
      >
        <Flex sx={styles.hero}>
          <Box>
            <Heading as="h1" variant="hero" color="white">
              {t('home.hero')}
            </Heading>
            <Text variant="regular" color="white ">
              {t('home.tagline')}
            </Text>
          </Box>
          <Box
            sx={{
              width: ["100%", "100%", "30%"],
            }}
          >
            <Flex sx={{ justifyContent: "center" }}>
              <Box
                sx={{
                  width: "200px",
                  height: "200px",
                  position: "relative",
                }}
              >
                <Flex
                  sx={{
                    gap: 1,
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    top: "0px",
                  }}
                >
                  <GatsbyLink to="/contact">
                    <Button variant="primary">{t('home.letsChat')}</Button>
                  </GatsbyLink>
                </Flex>
                <Loader />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
        }}
      >
        <Box
          as="article"
          sx={{
            py: [4],
          }}
        >
          <Grid gap={[1]} columns={[1, 1, 1, 1, "1fr 3fr", "1fr 3fr"]}>
            <Box
              sx={{
                overflow: "hidden",
                borderRadius: "10px",
                height: "min-content",
                width: ["100%", "50%", "50%", "50%", "100%"],
              }}
            >
              <StaticImage
                style={{ height: "300px" }}
                src="../images/devin_portrait.jpg"
                alt="devin portrait"
              />
            </Box>
            <Box
              sx={{
                px: [0, 0, 0, 0, 4],
                pt: [3, 3, 3, 3, 0],
              }}
            >
              <Box
                sx={{
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <Heading as="h2" variant="subheading1">
                  {t('home.heyThere')}
                </Heading>
                <Text variant="regular">
                  {t('home.intro')}{" "}
                  <GatsbyLink
                    to="/about"
                    sx={{
                      color: "blue",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "#E07A5F",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {t('home.strongRecord')}
                  </GatsbyLink>{" "}
                  {t('home.introContinued')}{" "}
                  <GatsbyLink
                    to="/contact"
                    sx={{
                      color: "blue",
                      fontWeight: "bold",
                      textDecoration: "underline",
                      "&:hover": {
                        color: "#E07A5F",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {t('home.reachOut')}
                  </GatsbyLink>
                  !
                </Text>
              </Box>
            </Box>
          </Grid>
        </Box>
        <Box as="section" sx={{ mt: 3 }}>
          <Heading as="h3" variant="subheading1">
            {t('home.recentPosts')}
          </Heading>
          <Grid
            sx={{
              mb: 4,
              width: "100%",
            }}
            gap={3}
            columns={[1]}
          >
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                post={post}
                postContent={post.excerpt}
              />
            ))}
          </Grid>
        </Box>
        <Box as="section" sx={{ mt: 3 }}>
          <Heading as="h3" variant="subheading1">
            {t('home.recentProjects')}
          </Heading>
          <Grid
            sx={{
              mb: 4,
              width: "100%",
            }}
            gap={3}
            columns={[1]}
          >
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </Grid>
        </Box>
        <Box as="section" sx={{ mb: 4 }}>
          <Heading as="h3" variant="subheading1">
            {t('home.readingList')}
          </Heading>
          <Flex
            sx={{
              gap: 3,
              overflowX: "scroll",
            }}
          >
            {books.map((book) => (
              <BookCard key={book.title} book={book} />
            ))}
          </Flex>
        </Box>
        <Box sx={{ mb: 4 }} as="section">
          <CallToAction
            title={t('home.cta.title')}
            content={t('home.cta.content')}
            buttonText={t('home.cta.button')}
            pageLink={"/about"}
          />
        </Box>
      </Box>
    </Box>
  );
};

const styles = {
  hero: {
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: [
      "center",
      "center",
      "center",
      "center",
      "center",
      "space-between",
    ],
    width: ["90%", "80%", "70%"],
    margin: "0 auto",
    textAlign: ["center", "center", "center", "center", "center", "left"],
    gap: "30px",
  },
};

export const landingPageQuery = graphql`
  query LandingPageQuery($language: String!) {
    locales: allLocale(filter: {language: {eq: $language}}) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
    blogPosts: allMdx(
      filter: {
        frontmatter: { draft: { eq: false } }
        internal: { contentFilePath: { regex: "/content/blog/" } }
      }
      sort: { frontmatter: { date: DESC } }
      limit: 3
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
          }
          excerpt(pruneLength: 100)
        }
      }
    }

    projects: allMdx(
      sort: { frontmatter: { startDate: DESC } }
      filter: {
        internal: { contentFilePath: { regex: "/content/projects/" } }
        frontmatter: { draft: { eq: false } }
      }
      limit: 3
    ) {
      edges {
        node {
          fields {
            slug
          }
          excerpt(pruneLength: 100)
          frontmatter {
            title
            startDate(formatString: "MMMM, YYYY")
            image1 {
              childImageSharp {
                gatsbyImageData
              }
            }
            technologies {
              name
              image {
                childImageSharp {
                  gatsbyImageData
                  original {
                    src
                  }
                }
              }
            }
          }
        }
      }
    }

    books: allMdx(
      filter: { internal: { contentFilePath: { regex: "/content/books/" } } }
      sort: { frontmatter: { date: DESC } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            url
            image {
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

export default IndexPage;
