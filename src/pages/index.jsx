/** @jsx jsx */
import { graphql, Link as GatsbyLink } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { jsx, Text, Button, Flex, Box, Grid, Heading } from "theme-ui";
import { useState } from "react";

import BookCard from "../components/BookCard/BookCard";
import CallToAction from "../components/CallToAction";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard/PostCard";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Seo from "../components/Seo/Seo";

const IndexPage = ({ data }) => {
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

  const allBooks = [
    ...currentlyReading.map((book) => ({
      ...book,
      read: false,
      image: book.cover_urls?.open_library || book.cover_urls?.google_books || book.cover_image_url,
    })),
    ...recentlyFinished.map((book) => ({
      ...book,
      read: true,
      image: book.cover_urls?.open_library || book.cover_urls?.google_books,
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
              Dev the Developer
            </Heading>
            <Text variant="regular" color="white ">
              I transform problems into thoughtful, scalable solutions
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
                    <Button variant="primary">Let's Chat</Button>
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
                  Hey there!
                </Heading>
                <Text variant="regular">
                  Hey! My name is Devin, but you can call me Dev. I'm a
                  results-oriented Full Stack Web Developer with 4 years of
                  professional experience in designing, developing, and
                  maintaining dynamic web applications. My expertise spans a
                  wide range of web technologies. I have a{" "}
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
                    strong record
                  </GatsbyLink>{" "}
                  of collaborating with cross-functional teams to deliver
                  innovative solutions while translating complex business needs
                  into functional, user-friendly software. If you're interested
                  in working together, feel free to{" "}
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
                    reach out
                  </GatsbyLink>
                  !
                </Text>
              </Box>
            </Box>
          </Grid>
        </Box>
        <Box as="section" sx={{ mt: 3 }}>
          <Heading as="h3" variant="subheading1">
            Recent Posts
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
            Recent Projects
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
            <Heading as="h3" variant="subheading1" sx={{ mb: 0 }}>
              Reading List
            </Heading>
            <Flex sx={{ gap: 2 }}>
              <Button
                variant={
                  bookFilter === "all" ? "toggleActive" : "toggleInactive"
                }
                onClick={() => setBookFilter("all")}
              >
                All
              </Button>
              <Button
                variant={
                  bookFilter === "read" ? "toggleActive" : "toggleInactive"
                }
                onClick={() => setBookFilter("read")}
              >
                Read
              </Button>
              <Button
                variant={
                  bookFilter === "unread" ? "toggleActive" : "toggleInactive"
                }
                onClick={() => setBookFilter("unread")}
              >
                Unread
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
                  overflowX: "scroll",
                  width: "100%",
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
                  No {bookFilter === "read" ? "read" : "unread"} books to
                  display.
                </Text>
              </Box>
            )}
          </Box>
        </Box>
        <Box sx={{ mb: 4 }} as="section">
          <CallToAction
            title={"Let's Work Together"}
            content={
              "I'm an pasionate developer who is always trying to master new skills and be of service to those I work with."
            }
            buttonText={"Learn how I can help"}
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
  query LandingPageQuery {
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
          cover_image_url
          goodreads_url
          cover_urls {
            open_library
            google_books
          }
        }
        recently_finished {
          title
          author
          finished_date
          isbn
          goodreads_url
          cover_urls {
            open_library
          }
        }
      }
    }
  }
`;

export default IndexPage;
