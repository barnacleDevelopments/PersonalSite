/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import { Text, Button, Flex, Box, Grid, Link, Heading } from "theme-ui";
import {
  faBrain,
  faBug,
  faChartLine,
  faDesktop,
  faLaptopCode,
  faPencil,
  faPeopleArrows,
  faRocket,
  faServer,
  faStore,
  faTabletAlt,
} from "@fortawesome/free-solid-svg-icons";
import Seo from "../components/app/Seo";
import Loader from "../components/Loader";
import PostCard from "../components/blog/PostCard";
import CallToAction from "../components/CallToAction";

const IndexPage = ({ data }) => {
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

  return (
    <Box>
      <Seo />
      <Box
        sx={{
          bg: "primary",
          pt: 5,
          pb: 5,
          mt: "60px",
          width: "100%",
          textTransform: "uppercase",
        }}
      >
        <Flex
          sx={{
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
            textAlign: [
              "center",
              "center",
              "center",
              "center",
              "center",
              "left",
            ],
            gap: "30px",
          }}
        >
          <Box>
            <Heading as="h1" variant="hero" color="white">
              Dev the Developer
            </Heading>
            <Text variant="regular" color="white ">
              I translate business requirements into awesome solutions.
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
                  <Link href="/contact">
                    <Button variant="primary">Let's Chat</Button>
                  </Link>
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
                  wide range of web technologies. I have a strong record of
                  collaborating with cross-functional teams to deliver
                  innovative solutions while translating complex business needs
                  into functional, user-friendly software. Above all, I pride
                  myself on being a proven self-starter who thrives in both
                  independent and team environments. If you're interested in
                  working together, feel free to{" "}
                  <Link href="/contact">reach out</Link>!
                </Text>
              </Box>
            </Box>
          </Grid>
        </Box>
        <CallToAction
          title={"Let's Work Together"}
          content={
            "I'm an pasionate developer who is always trying to master new skills and be of service to those I work with."
          }
          buttonText={"Learn how I can help"}
          pageLink={"/about"}
        />
        <Box as="section" sx={{ mt: 4 }}>
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
        <Box as="section" sx={{ mb: 4 }}>
          <Heading as="h3" variant="subheading1">
            Reading List
          </Heading>
          <Flex
            sx={{
              gap: 3,
              overflowX: "scroll",
            }}
          >
            {books.map((book) => {
              const image = getImage(book.image);
              return (
                <Link
                  sx={{
                    width: "150px",
                    flex: "0 0 auto",
                  }}
                  href={book.url}
                >
                  <GatsbyImage
                    sx={{
                      width: "100%",
                      border: "2px solid black",
                      borderColor: "primary",
                      borderRadius: 3,
                    }}
                    key={book.title}
                    alt={book.title}
                    image={image}
                  />
                </Link>
              );
            })}
          </Flex>
        </Box>
      </Box>
    </Box>
  );
};

export const landingPageQuery = graphql`
  query LandingPageQuery {
    blogPosts: allMarkdownRemark(
      filter: {
        frontmatter: { draft: { eq: false } }
        fileAbsolutePath: { regex: "//blog//" }
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
          excerpt(truncate: true, format: HTML, pruneLength: 100)
        }
      }
    }

    books: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//books//" } }
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
          excerpt(truncate: true, format: HTML, pruneLength: 100)
        }
      }
    }
  }
`;

export default IndexPage;
