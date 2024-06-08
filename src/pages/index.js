/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import ReviewCard from "../components/cards/ReviewCard";
import { StaticImage } from "gatsby-plugin-image";
import { Text, Button, Flex, Box, Grid, Link, Heading } from "theme-ui";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import {
  faBrain,
  faBug,
  faChartLine,
  faDesktop,
  faPeopleArrows,
  faRocket,
  faServer,
  faStore,
  faTabletAlt,
} from "@fortawesome/free-solid-svg-icons";
import Seo from "../components/app/Seo";
import Loader from "../components/Loader";
import { faGit } from "@fortawesome/free-brands-svg-icons";

const IndexPage = ({ data }) => {
  const landingPageData = data.markdownRemark.frontmatter;

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
                alt="dev portrait"
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
                  My name is Dev. I'm a web developer located in Halifax Nova
                  Scotia. I specialize in building websites and web applications
                  for small to medium sized businesses. I work diligently to
                  ensure that those I work with receive a product they can be
                  proud of. I'm always looking for new and exciting projects to
                  work on. If you're interested in working together, feel free
                  to reach out!
                </Text>
              </Box>
            </Box>
          </Grid>
        </Box>
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
              <Flex alignItems="center">
                <Icon size="2x" icon={faBrain} />
                <Text variant="regular" sx={styles.skillText}>
                  Analytical Thinker
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex alignItems="center">
                <Icon size="2x" icon={faPeopleArrows} />
                <Text variant="regular" sx={styles.skillText}>
                  Client Focused
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex alignItems="center">
                <Icon size="2x" icon={faChartLine} />
                <Text variant="regular" sx={styles.skillText}>
                  Adaptable
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex alignItems="center">
                <Icon size="2x" icon={faStore} />
                <Text variant="regular" sx={styles.skillText}>
                  Detail Oriented
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex alignItems="center">
                <Icon size="2x" icon={faBrain} />
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
              <Flex alignItems="center">
                <Icon size="2x" icon={faServer} />
                <Text variant="regular" sx={styles.skillText}>
                  Back-End Development
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex alignItems="center">
                <Icon size="2x" icon={faTabletAlt} />
                <Text variant="regular" sx={styles.skillText}>
                  Front-End Development
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex alignItems="center">
                <Icon size="2x" icon={faDesktop} />
                <Text variant="regular" sx={styles.skillText}>
                  Responsive Design
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex alignItems="center">
                <Icon size="2x" icon={faBug} />
                <Text variant="regular" sx={styles.skillText}>
                  Testing/Debugging
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex alignItems="center">
                <Icon size="2x" icon={faRocket} />
                <Text variant="regular" sx={styles.skillText}>
                  Web Performance
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex alignItems="center">
                <Icon size="2x" icon={faGit} />
                <Text variant="regular" sx={styles.skillText}>
                  Version Control/Git
                </Text>
              </Flex>
            </Box>
            <Box sx={styles.skillCard}>
              <Flex alignItems="center">
                <Icon size="2x" icon={faGit} />
                <Text variant="regular" sx={styles.skillText}>
                  Documenting
                </Text>
              </Flex>
            </Box>
          </Grid>
        </Box>
        <Box
          as="article"
          sx={{
            mt: 5,
            mb: 5,
          }}
        >
          <Heading as="h1" variant="hero" textAlign="center">
            What People Say...
          </Heading>
          <Box>
            {landingPageData.socials.map((s, index) => (
              <ReviewCard key={index} content={s.content} />
            ))}
          </Box>
        </Box>
        <Flex
          sx={{
            textAlign: "center",
            flexDirection: "column",
            justifyContent: "center",
            my: [5],
            px: [0, 3],
            bg: "primary",
            color: "white",
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Heading as="h2" variant="subheading1" color="white">
            Let's Work Together
          </Heading>
          <Text variant="regular" sx={{ color: "white" }}>
            I'm an pasionate developer who is always trying to master new skills
            and be of service to those I work with.
          </Text>
          <Box sx={{ mt: 4 }}>
            <Link href="/about">
              <Button variant="primary">Learn how I can help</Button>
            </Link>
          </Box>
        </Flex>
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
        socials {
          content
        }
        latestProject {
          comment
          projectName
          projectLink
          projectthumbnail {
            childImageSharp {
              gatsbyImageData
            }
          }
        }
        indexContent
        indexHeader
      }
    }
  }
`;

export default IndexPage;
