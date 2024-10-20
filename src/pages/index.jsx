/** @jsx jsx */
import { Paragraph, jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import { StaticImage } from "gatsby-plugin-image";
import { Card, Text, Button, Flex, Box, Grid, Link, Heading } from "theme-ui";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
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
import { faGit } from "@fortawesome/free-brands-svg-icons";
import { getProjects, getProjectVoteCounts } from "../functions/project-voting";
import { useEffect, useState } from "react";
import PostCard from "../components/blog/PostCard";
import CallToAction from "../components/CallToAction";

const IndexPage = ({ data }) => {
  const [projects, setProjects] = useState([]);

  console.log(data);
  const landingPageData = data.markdownRemark.frontmatter;
  console.log(data);
  const posts = data.blogPosts.edges
    .filter((_, index) => index < 4)
    .map(({ node }) => ({
      ...node.frontmatter,
      ...node.fields,
      html: node.html,
    }));
  useEffect(() => {
    if (typeof window !== "undefined") {
      const init = async () => {
        await getProjectWithContent();
        await updateProjectVoteCounts();
      };
      init();
    }
  }, []);

  const updateProjectVoteCounts = async () => {
    const voteCounts = await getProjectVoteCounts();
    console.log(voteCounts);
    setProjects((projects) => {
      return projects
        .map((project) => {
          if (voteCounts[project.id]) {
            return {
              ...project,
              votes: Number.parseFloat(voteCounts[project.id]),
            };
          }
          return project;
        })
        .sort((a, b) => b.votes - a.votes);
    });
  };

  const getProjectWithContent = async () => {
    const projects = await getProjects();
    if (projects && projects.length > 0) {
      const formattedProjects = projects.map((project) => {
        return {
          id: project.id,
          title: project.title,
          votes: 0,
          link: `/projects/${project.id}`,
        };
      });
      setProjects(formattedProjects.filter((x, index) => index < 3));
    }
  };

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
              {landingPageData.indexHeader}
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
          <Grid gap={[1]} columns={[1, 1, 1, 1, "1fr 2fr", "1fr 2fr"]}>
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
                py: 3,
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
                  My name is Dev. I'm a web developer located in Montreal. I
                  specialize in building websites and web applications for small
                  to medium sized businesses. I work diligently to ensure that
                  those I work with receive a product they can be proud of. I'm
                  always looking for new and exciting projects to work on. If
                  you're interested in working together, feel free to{" "}
                  <Link href="/contact">reach out</Link>!
                </Text>
              </Box>
            </Box>
          </Grid>
        </Box>
        {/* <Box sx={{ mb: 3 }}> */}
        {/*   <Heading as="h3" variant="subheading1"> */}
        {/*     Top Projects */}
        {/*   </Heading> */}
        {/*   <Paragraph variant="small" sx={{ mb: 3 }}> */}
        {/*     Checkout my{" "} */}
        {/*     <Link href="/projects">web3 educational project voting</Link>{" "} */}
        {/*     feature to grade my projects using blockchain technology. */}
        {/*   </Paragraph> */}
        {/*   {projects.map((project) => { */}
        {/*     return ( */}
        {/*       <Card key={project.id} variant="project" sx={{ mb: 3 }}> */}
        {/*         <Flex sx={{ justifyContent: "space-between", width: "100%" }}> */}
        {/*           <Box> */}
        {/*             <Heading mb={2}>{project.title}</Heading> */}
        {/*             <Text>{project.votes} Votes</Text> */}
        {/*           </Box> */}
        {/*         </Flex> */}
        {/*         <Link href={project.link}> */}
        {/*           <Button */}
        {/*             title={"View more about this project."} */}
        {/*             sx={{ mt: 3 }} */}
        {/*             variant="secondary" */}
        {/*           > */}
        {/*             View */}
        {/*           </Button> */}
        {/*         </Link> */}
        {/*       </Card> */}
        {/*     ); */}
        {/*   })} */}

        {/*   <Link href="/projects" sx={{ display: "block", mt: 3 }}> */}
        {/*     <Button title="View a list of all my projects." variant="primary"> */}
        {/*       View More Projects */}
        {/*     </Button> */}
        {/*   </Link> */}
        {/* </Box> */}
        <Box
          as="article"
          sx={{
            py: 2,
          }}
        >
          <Heading as="h3" variant="subheading1">
            Soft Skills
          </Heading>
          <Grid gap={3} columns={[1, null, 2]}>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faBrain} />
                <Text variant="regular" sx={styles.skillText}>
                  Analytical Thinker
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faPeopleArrows} />
                <Text variant="regular" sx={styles.skillText}>
                  Client Focused
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faChartLine} />
                <Text variant="regular" sx={styles.skillText}>
                  Adaptable
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faStore} />
                <Text variant="regular" sx={styles.skillText}>
                  Detail Oriented
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faLaptopCode} />
                <Text variant="regular" sx={styles.skillText}>
                  Active Learner
                </Text>
              </Flex>
            </Box>
          </Grid>
          <Heading sx={{ mt: 4 }} as="h3" variant="subheading1">
            Hard Skills
          </Heading>
          <Grid gap={3} columns={[1, null, 2]}>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faServer} />
                <Text variant="regular" sx={styles.skillText}>
                  Back-End Development
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faTabletAlt} />
                <Text variant="regular" sx={styles.skillText}>
                  Front-End Development
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faDesktop} />
                <Text variant="regular" sx={styles.skillText}>
                  Responsive Design
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faBug} />
                <Text variant="regular" sx={styles.skillText}>
                  Testing/Debugging
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faRocket} />
                <Text variant="regular" sx={styles.skillText}>
                  Web Performance
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faGit} />
                <Text variant="regular" sx={styles.skillText}>
                  Version Control/Git
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex>
                <Icon size="2x" icon={faPencil} />
                <Text variant="regular" sx={styles.skillText}>
                  Documenting
                </Text>
              </Flex>
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
        <Heading as="h3" variant="subheading1">
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

const styles = {
  skillCard: {
    pb: 4,
    pl: [4, 4],
    pt: 4,
    bg: "#30362F",
    color: "white",
    borderRadius: "5px",
  },
  skillText: { pl: 3, color: "white" },
};

export const landingPageQuery = graphql`
  query LandingPageQuery {
    markdownRemark(fileAbsolutePath: { regex: "/landing.md/" }) {
      frontmatter {
        indexContent
        indexHeader
      }
    }
    projects: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//projects//" } }
      sort: { frontmatter: { endDate: DESC } }
      limit: 3
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            startDate
            endDate
            status
            date
          }
          html
        }
      }
    }
    blogPosts: allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//blog//" } }
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
            thumbnail {
              childImageSharp {
                gatsbyImageData
              }
            }
            category
          }
          html
        }
      }
    }
  }
`;

export default IndexPage;
