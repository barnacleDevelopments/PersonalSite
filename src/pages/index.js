/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import Layout from "../components/app/Layout";
import ReviewCard from "../components/cards/ReviewCard";
import { StaticImage } from "gatsby-plugin-image";
import { Text, Themed, Button, Flex, Box, Grid, Link } from "theme-ui";
import { FontAwesomeIcon as Icon } from "@fortawesome/react-fontawesome";
import { faChartLine, faListOl, faMousePointer, faStore, faTabletAlt, faUniversalAccess } from "@fortawesome/free-solid-svg-icons";
import { faAddressCard, faLightbulb } from "@fortawesome/free-regular-svg-icons";
import Seo from "../components/app/Seo";
import Loader from "../components/Loader";

const IndexPage = ({ data }) => {
  const landingPageData = data.markdownRemark.frontmatter;

  return (
    <Layout>
      <Seo />
      <Box sx={{
        bg: "primary",
        pt: 5,
        pb: 5,
        mt: "60px",
        width: "100%",
        textTransform: "uppercase"
      }} >
        <Flex sx={{
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: ["center", "center", "center", "center", "space-between"],
          width: ["90%", "80%", "70%"],
          margin: "0 auto",
          textAlign: ['center', "center", "center", "center", 'left'],
          gap: "30px"
        }}  >
          <Box>
            <Themed.h1 sx={{
              mb: 4,
              color: "secondary"
            }}>
              DEV's WEB SHOP
            </Themed.h1>
            <Text variant="hero">{landingPageData.indexHeader}</Text>
          </Box>
          <Box
            sx={{
              width: ["100%", "100%", "30%"],
            }}
          >
            <Flex sx={{ justifyContent: "center" }} >
              <Box sx={{
                width: "200px",
                height: "200px",
                position: "relative"
              }}>
                <Flex sx={{
                  gap: 1,
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  top: "0px",

                }} >
                  <Link href="/services">
                    <Button variant="primary">GET AN ESTIMATE</Button>
                  </Link>
                </Flex>
                <Loader />
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Box>

      <Box sx={{
        margin: "0 auto",
        width: ["90%", "80%", "70%"],
      }}>
        <Box sx={{
          py: [5]
        }}>
          <Grid gap={3} columns={[1, 2, "1fr 2fr"]}>
            <Box>
              <StaticImage style={{ height: "300px" }} src="../images/devin_portrait.jpg" alt="dev portrait" />
            </Box>
            <Box sx={{
              px: [2, 4],
              py: 3
            }}>
              <Box sx={{
                alignItems: "center",
                height: "100%"
              }} >
                <Themed.h2 sx={{
                  mb: 3,
                }} >
                  Hey there!
                </Themed.h2>
                <Text variant="regular">
                  My name is Dev. I'm a web developer
                  located in Halifax Nova Scotia. I'm here to convince you that
                  having a modern web presence is a secret
                  weapon in this modern climate.
                  Not convinced? Keep scrolling.
                </Text>
              </Box>
            </Box>
          </Grid>
        </Box>
        <Box>
          <Themed.h2
            sx={{
              fontWeight: "500",
              py: 3,
              textAlign: "center",
              bg: "primary",
              color: "secondary"
            }}>
            The Breakdown
          </Themed.h2>
          {/* <TriangleTab /> */}
        </Box>
        <Box sx={{
          border: `2px solid`,
          borderLeftWidth: "2px",
          borderRightWidth: "2px",
          borderBottomWidth: "2px",
          borderColor: "primary"
        }}>
          <Box sx={{
            py: 5,
            px: 4,
            bg: "secondary",
          }}>
            <Themed.h3 sx={{
              mb: 4
            }}>THE BENEFITS</Themed.h3>
            <Grid gap={3} columns={[1, null, 2]}>
              <Box sx={{
                pb: 4,
                pl: [0, 4]
              }}>
                <Flex alignItems="center">
                  <Icon size="2x" icon={faLightbulb} />
                  <Text variant="regular" sx={{ pl: 3 }}>Provides Consumer Insights</Text>
                </Flex>
              </Box>
              <Box sx={{
                pb: 4,
                pl: [0, 4]
              }}>
                <Flex alignItems="center">
                  <Icon size="2x" icon={faChartLine} />
                  <Text variant="regular" sx={{ pl: 3 }} >Increases Potential Growth</Text>
                </Flex>
              </Box>
              <Box sx={{
                pb: 4,
                pl: [0, 4]
              }}>
                <Flex alignItems="center">
                  <Icon size="2x" icon={faAddressCard} />
                  <Text variant="regular" sx={{ pl: 3 }}>Increases Credibility</Text>
                </Flex>
              </Box>
              <Box sx={{
                pb: 4,
                pl: [0, 4]
              }}>
                <Flex alignItems="center">
                  <Icon size="2x" icon={faStore} />
                  <Text variant="regular" sx={{ pl: 3 }}>Increases Market Reach</Text>
                </Flex>
              </Box>
            </Grid>
          </Box>
          <Box sx={{
            py: 2,
            px: 4,
            bg: "secondary"
          }}>
            <Themed.h3 sx={{
              mb: 4
            }} >HOW DOES IT WORK?</Themed.h3>
            <Grid gap={3} columns={[1, null, 2]} >
              <Box sx={{
                pb: 4,
                pl: [0, 4]
              }}>
                <Flex alignItems="center">
                  <Icon size="2x" icon={faListOl} />
                  <Text variant="regular" sx={{ pl: 3 }} >Frugal Search Engine Optimization (SEO)</Text>
                </Flex>
              </Box>
              <Box sx={{
                pb: 4,
                pl: [0, 4]
              }}>
                <Flex alignItems="center">
                  <Icon size="2x" icon={faTabletAlt} />
                  <Text variant="regular" sx={{ pl: 3 }}>Stunning Custom User Interface (UI)</Text>
                </Flex>
              </Box>
              <Box sx={{
                pb: 4,
                pl: [0, 4]
              }}>
                <Flex alignItems="center">
                  <Icon size="2x" icon={faUniversalAccess} />
                  <Text variant="regular" sx={{ pl: 3 }}>Accessibility Features</Text>
                </Flex>
              </Box>
              <Box sx={{
                pb: 4,
                pl: [0, 4]
              }}>
                <Flex alignItems="center">
                  <Icon size="2x" icon={faMousePointer} />
                  <Text variant="regular" sx={{ pl: 3 }}>Interactive Features</Text>
                </Flex>
              </Box>
            </Grid>
          </Box>
        </Box>
        <Box sx={{
          mt: 5,
          mb: 5
        }}>
          <Themed.h2
            sx={{
              my: 4,
              textAlign: ["left", "center"],
              fontWeight: 600
            }}>
            What People Say...
          </Themed.h2>
          <Box>
            {landingPageData.socials.map((s, index) => <ReviewCard key={index} content={s.content} />)}
          </Box>
        </Box>
        <Flex sx={{
          textAlign: "center",
          flexDirection: "column",
          justifyContent: "center",
          my: [5],
          px: [0, 3],
          bg: "primary",
          color: "white",
          p: 4,
        }} >
          <Themed.h2 sx={{
            mb: 4,
          }}>
            Explore Services
          </Themed.h2>
          <Text
            variant="regular" sx={{ color: "white" }}>
            Whether you are looking for something simple or more advanced, I can create a custom solutions to represent your business at its best.
          </Text>
          <Box sx={{ mt: 4 }} >
            <Link href="/services" ><Button variant="primary">Choose Your Service</Button></Link>
          </Box>
        </Flex>
      </Box>
    </Layout >
  );
};

export const landingPageQuery = graphql`
query LandingPageQuery {
  markdownRemark(fileAbsolutePath: {regex: "\/landing.md/"}) {
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
`

export default IndexPage;
