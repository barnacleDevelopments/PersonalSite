/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import ReviewCard from "../components/cards/ReviewCard";
import { StaticImage } from "gatsby-plugin-image";
import { Text, Button, Flex, Box, Grid, Link } from "theme-ui";
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
import { faLightbulb } from "@fortawesome/free-regular-svg-icons";
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
              "space-between",
            ],
            width: ["90%", "80%", "70%"],
            margin: "0 auto",
            textAlign: ["center", "center", "center", "center", "left"],
            gap: "30px",
          }}
        >
          <Box>
            <h1
              sx={{
                mb: 4,
                color: "secondary",
              }}
            >
              Dev the Developer
            </h1>
            <Text variant="hero">{landingPageData.indexHeader}</Text>
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
          sx={{
            py: [5],
          }}
        >
          <Grid gap={3} columns={[1, 2, "1fr 2fr"]}>
            <Box>
              <StaticImage
                style={{ height: "300px" }}
                src="../images/devin_portrait.jpg"
                alt="dev portrait"
              />
            </Box>
            <Box
              sx={{
                px: [2, 4],
                py: 3,
              }}
            >
              <Box
                sx={{
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <h2
                  sx={{
                    mb: 3,
                  }}
                >
                  Hey there!
                </h2>
                <Text variant="regular">
                  My name is Dev. I'm a web developer located in Halifax Nova
                  Scotia. I specialize in building websites and web applications
                  for small to medium sized businesses. I work diligently to
                  ensure that those I work with recieve a product they can be
                  proud of. I'm always looking for new and exciting projects to
                  work on. If you're interested in working together, feel free
                  to reach out!
                </Text>
              </Box>
            </Box>
          </Grid>
        </Box>
        <Box>
          <h2
            sx={{
              fontWeight: "500",
              py: 3,
              textAlign: "center",
              bg: "primary",
              color: "secondary",
            }}
          >
            Skills
          </h2>
          {/* <TriangleTab /> */}
        </Box>
        <Box
          sx={{
            border: `2px solid`,
            borderLeftWidth: "2px",
            borderRightWidth: "2px",
            borderBottomWidth: "2px",
            borderColor: "primary",
            pb: 3,
            bg: "secondary",
          }}
        >
          <Box
            sx={{
              py: 5,
              px: 4,
            }}
          >
            <h3
              sx={{
                mb: 4,
              }}
            >
              Soft Skills
            </h3>
            <Grid gap={3} columns={[1, null, 2]}>
              <Box sx={styles.skillCard}>
                <Flex alignItems="center">
                  <Icon size="2x" icon={faLightbulb} />
                  <Text variant="regular" sx={styles.skillText}>
                    Creative Problem Solver
                  </Text>
                </Flex>
              </Box>
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
                    Adaptable and Flexible
                  </Text>
                </Flex>
              </Box>
              <Box sx={styles.skillCard}>
                <Flex alignItems="center">
                  <Icon size="2x" icon={faStore} />
                  <Text variant="regular" sx={styles.skillText}>
                    Attentive to Details
                  </Text>
                </Flex>
              </Box>
              <Box sx={styles.skillCard}>
                <Flex alignItems="center">
                  <Icon size="2x" icon={faBrain} />
                  <Text variant="regular" sx={styles.skillText}>
                    Curious and a Willing to Learn New Things
                  </Text>
                </Flex>
              </Box>
            </Grid>
          </Box>
          <Box
            sx={{
              py: 2,
              px: 4,
              bg: "secondary",
            }}
          >
            <h3
              sx={{
                mb: 4,
              }}
            >
              Hard Skills
            </h3>
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
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            mt: 5,
            mb: 5,
          }}
        >
          <h2
            sx={{
              my: 4,
              textAlign: ["left", "center"],
              fontWeight: 600,
            }}
          >
            What People Say...
          </h2>
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
          }}
        >
          <h2
            sx={{
              mb: 4,
            }}
          >
            Let's Work Together
          </h2>
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
          projectThumnail {
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
