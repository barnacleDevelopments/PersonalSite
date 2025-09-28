/** @jsx jsx */
import { graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { jsx, Text, Button, Flex, Box, Grid, Link, Heading } from "theme-ui";

import BookCard from "../components/BookCard/BookCard";
import CallToAction from "../components/CallToAction";
import Loader from "../components/Loader";
import PostCard from "../components/PostCard/PostCard";
import ProjectCard from "../components/ProjectCard/ProjectCard";
import Seo from "../components/Seo/Seo";

import React, { useEffect, useState } from "react";

const SweatWidget = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const WALLET_ADDRESS = "sweat-relayer.near"; // Replace with your NEAR wallet
  const NEARBLOCKS_API_KEY = "58CC3656CB82410A8BBADA80A8405458"; // Ensure you have this in your environment variables

  // Fetch $SWEAT balance
  const fetchBalance = async () => {
    try {
      const res = await fetch(
        `https://api.nearblocks.io/v1/account/${WALLET_ADDRESS}/tokens`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${NEARBLOCKS_API_KEY}`, // Make sure this is set
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();

      // Find SWEAT token by contract name
      const sweat = data.balances.find((b) => b.contract === "token.sweat");

      // Convert to human-readable format (18 decimals)
      const humanReadable = sweat ? Number(sweat.amount) / 1e18 : 0;

      setBalance(humanReadable);
    } catch (error) {
      console.error("Balance fetch error:", error);
      setBalance(null);
    }
  };

  // Fetch last 5 transactions involving $SWEAT
  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `https://api.nearblocks.io/v1/account/txns?account=${WALLET_ADDRESS}&limit=10`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${NEARBLOCKS_API_KEY}`, // Ensure you have this in your environment variables
          },
        },
      );
      const data = await res.json();
      const sweatTxs = data.txns
        .filter((tx) => tx.receiver === "token.sweat")
        .slice(0, 5);
      setTransactions(sweatTxs);
    } catch (error) {
      console.error("Transactions fetch error:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchBalance();
      //await fetchTransactions();
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <div className="max-w-md p-4 bg-white shadow-xl rounded-2xl border border-gray-100">
      <h2 className="text-xl font-bold mb-4 text-purple-700">
        💧 $SWEAT Tracker
      </h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <>
          <p className="text-lg mb-2">
            Wallet: <span className="font-mono text-sm">{WALLET_ADDRESS}</span>
          </p>
          <p className="text-2xl font-semibold text-green-600 mb-4">
            Balance: {balance.toFixed(2)} SWEAT
          </p>
          <h3 className="text-md font-semibold mb-2">Last Transactions:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            {transactions.map((tx) => (
              <li key={tx.hash} className="border-b pb-1">
                <a
                  href={`https://nearblocks.io/txns/${tx.hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline"
                >
                  {tx.hash.slice(0, 10)}...
                </a>{" "}
                on {new Date(tx.block_timestamp).toLocaleDateString()}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

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
          mt: "60px",
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
                  wide range of web technologies. I have a{" "}
                  <Link variant="text" href="/about">
                    strong record
                  </Link>{" "}
                  of collaborating with cross-functional teams to deliver
                  innovative solutions while translating complex business needs
                  into functional, user-friendly software. If you're interested
                  in working together, feel free to{" "}
                  <Link variant="text" href="/contact">
                    reach out
                  </Link>
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
          <Heading as="h3" variant="subheading1">
            Reading List
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
            title={"Let's Work Together"}
            content={
              "I'm an pasionate developer who is always trying to master new skills and be of service to those I work with."
            }
            buttonText={"Learn how I can help"}
            pageLink={"/about"}
          />
        </Box>
      </Box>
      <SweatWidget />
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
