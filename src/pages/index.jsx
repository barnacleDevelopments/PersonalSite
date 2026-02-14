import { graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import { useState } from "react";
import { Box, Button, Flex, Grid, Heading, Text } from "theme-ui";

import BookCard from "../components/BookCard/BookCard";
import CallToAction from "../components/CallToAction";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard/PostCard";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Seo from "../components/Seo/Seo";
import Tooltip from "../components/Tooltip/Tooltip";
import Layout from "../components/app/Layout";
import { getYearsOfExperience } from "../utils/experience";

const IndexPage = ({ data }) => {
  const { t } = useTranslation("index");
  const [bookFilter, setBookFilter] = useState("all");

  const posts = data.blogPosts.edges
    .filter((_, index) => index < 4)
    .map(({ node }) => ({
      ...node.frontmatter,
      ...node.fields,
      excerpt: node.excerpt,
    }));

  const readingProgressData = data.readingProgress?.nodes?.[0] || {};
  const currentlyReading = readingProgressData.currently_reading || [];
  const recentlyFinished = readingProgressData.recently_finished || [];

  // Create a map of book covers by filename (without extension)
  const bookCoverMap = {};
  for (const cover of data.bookCovers?.nodes ?? []) {
    bookCoverMap[cover.name] = cover.childImageSharp;
  }

  const allBooks = [
    ...currentlyReading.map((book) => {
      // Try to find local cover
      let coverImage = null;
      if (book.cover_image) {
        const coverName = book.cover_image.replace(/\.[^/.]+$/, ""); // Remove extension
        coverImage = bookCoverMap[coverName] || null;
      }

      return {
        ...book,
        read: false,
        image: coverImage,
      };
    }),
    ...recentlyFinished.map((book) => ({
      ...book,
      read: true,
      image: null, // No covers for finished books
    })),
  ];

  const books = allBooks.filter((book) => {
    if (bookFilter === "read") return book.read === true;
    if (bookFilter === "unread") return !book.read;
    return true;
  });

  const projects = data.projects.edges.map(({ node }) => ({
    ...node.frontmatter,
    ...node.fields,
  }));

  return (
    <Layout>
      <Seo />
      <Box
        data-testid="hero"
        sx={{
          bg: "primary",
          pt: 5,
          pb: 5,
          width: "100%",
          textTransform: "uppercase",
          position: "relative",
        }}
      >
        <Flex
          sx={{
            flexWrap: ["wrap", "wrap", "nowrap"],
            alignItems: "center",
            justifyContent: ["center", "center", "space-between"],
            width: ["90%", "80%", "70%"],
            margin: "0 auto",
            textAlign: ["center", "center", "left"],
            gap: "30px",
          }}
        >
          <Box>
            <Heading as="h1" variant="hero" color="white">
              {t("hero_title")}
            </Heading>
            <Text variant="regular" color="white ">
              {t("hero_subtitle")}
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
                  <Link to="/contact">
                    <Button variant="primary">{t("lets_chat")}</Button>
                  </Link>
                </Flex>
                <Loader />
              </Box>
            </Flex>
          </Box>
        </Flex>
        <Box
          sx={{
            position: "absolute",
            bottom: 2,
            right: 3,
            textTransform: "none",
          }}
        >
          <Tooltip variant="light" text={t("tooltip_static_site")} />
        </Box>
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
                  {t("hey_there")}
                </Heading>
                <Text variant="regular">
                  {t("intro_text_1")}
                  {t("intro_text_years", { years: getYearsOfExperience() })}
                  {t("intro_text_2")}
                  <Link
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
                    {t("strong_record")}
                  </Link>
                  {t("intro_text_3")}
                  <Link
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
                    {t("reach_out")}
                  </Link>
                  !
                </Text>
              </Box>
            </Box>
          </Grid>
        </Box>
        <Box as="section" sx={{ mt: 3 }}>
          <Heading as="h3" variant="subheading1">
            {t("recent_posts")}
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
            {t("recent_projects")}
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
          <Flex
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Flex sx={{ alignItems: "center", gap: 2 }}>
              <Heading as="h3" variant="subheading1" sx={{ mb: 0 }}>
                {t("reading_list")}
              </Heading>
              <Tooltip text={t("reading_list_tooltip")} />
            </Flex>
            <Flex sx={{ gap: 2 }}>
              <Button
                variant={
                  bookFilter === "all" ? "toggleActive" : "toggleInactive"
                }
                onClick={() => setBookFilter("all")}
              >
                {t("filter_all")}
              </Button>
              <Button
                variant={
                  bookFilter === "read" ? "toggleActive" : "toggleInactive"
                }
                onClick={() => setBookFilter("read")}
              >
                {t("filter_read")}
              </Button>
              <Button
                variant={
                  bookFilter === "unread" ? "toggleActive" : "toggleInactive"
                }
                onClick={() => setBookFilter("unread")}
              >
                {t("filter_unread")}
              </Button>
            </Flex>
          </Flex>
          <Box
            sx={{
              minHeight: "250px",
              display: "flex",
              alignItems: "center",
            }}
          >
            {books.length > 0 ? (
              <Flex
                sx={{
                  gap: 3,
                  overflowX: "auto",
                  overflowY: "hidden",
                  width: "100%",
                  "&::-webkit-scrollbar": {
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-track": {
                    background: "muted",
                    borderRadius: "4px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    background: "primary",
                    borderRadius: "4px",
                    "&:hover": {
                      background: "text",
                    },
                  },
                }}
              >
                {books.map((book) => (
                  <BookCard key={book.title} book={book} />
                ))}
              </Flex>
            ) : (
              <Box
                sx={{
                  textAlign: "center",
                  width: "100%",
                  py: 4,
                  color: "primary",
                }}
              >
                <Text variant="regular">
                  {bookFilter === "read"
                    ? t("no_read_books")
                    : t("no_unread_books")}
                </Text>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ mb: 4 }} as="section">
          <CallToAction
            title={t("cta_title")}
            content={t("cta_content")}
            buttonText={t("cta_button")}
            pageLink={"/about"}
          />
        </Box>
      </Box>
    </Layout>
  );
};

export const landingPageQuery = graphql`
  query LandingPageQuery($language: String!) {
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

    readingProgress: allContentJson {
      nodes {
        currently_reading {
          id
          title
          author
          publisher
          description
          last_read
          progress_percent
          read_status
          cover_image_id
          isbn
          cover_image
        }
        recently_finished {
          title
          author
          finished_date
          isbn
        }
      }
    }

    bookCovers: allFile(filter: { sourceInstanceName: { eq: "images" }, relativeDirectory: { eq: "book-covers" } }) {
      nodes {
        relativePath
        name
        childImageSharp {
          gatsbyImageData(width: 150, height: 225, placeholder: BLURRED)
        }
      }
    }

    locales: allLocale(
      filter: { ns: { in: ["common", "index"] }, language: { eq: $language } }
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

export default IndexPage;
