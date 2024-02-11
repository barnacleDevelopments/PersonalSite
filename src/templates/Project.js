/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import showdown from "showdown";
import { getImage } from "gatsby-plugin-image";
import moment from "moment";

// Components
import { Box, Flex, Button, Heading, Text, Grid } from "theme-ui";
import Seo from "../components/app/Seo";

// Hooks
import useProjectVoting from "../hooks/project-voting";

function Project({ data }) {
  const { markdownRemark: node } = data;
  const converter = new showdown.Converter();
  const { uploadTaskProgress } = useProjectVoting();

  return (
    <Box>
      <Seo
        title={node.frontmatter.title}
        keywords={node.frontmatter.keywords.split(",")}
      />
      {/* Hero */}
      <Flex sx={pageWrapper}>
        <Heading as="h1" variant="hero" color="white">
          {node.frontmatter.title}
        </Heading>
        <Text
          sx={{
            my: 2,
            fontSize: 3,
          }}
        >
          {moment(node.frontmatter.date).format("MMM Do, YYYY")}
        </Text>
        <Text
          sx={{
            mb: 2,
            fontSize: 2,
          }}
        >
          {node.frontmatter.completeTime} Hours
        </Text>
        <Box>
          {" "}
          {node.frontmatter.link ? (
            <a href={node.frontmatter.link}>
              <Button mt={3} variant="primary" mr={2}>
                View Live Site
              </Button>
            </a>
          ) : (
            ""
          )}{" "}
          <Button onClick={() => uploadTaskProgress({ task: "view" })}>
            Mark as Viewed
          </Button>
        </Box>
      </Flex>
      {/* Section 1 */}
      <Box
        sx={{ ...sectionWrapperStyle, backgroundColor: "secondary" }}
        backgroundColor="#EEEEEE"
      >
        <Grid
          columns={[1, null, 2]}
          sx={{ ...sectionFlexStyle, alignItems: "center" }}
        >
          <Box sx={{ py: [4, 6], pr: [0, 5], order: [1, 2] }}>
            <Heading as="h2" variant="subheading1">
              Overview
            </Heading>
            <Text
              sx={paragraphStyles}
              dangerouslySetInnerHTML={{
                __html: converter.makeHtml(node.frontmatter.description),
              }}
            ></Text>
          </Box>
          <Box sx={{ order: [1, 2], mb: [5, 0], mt: [0, 3] }}>
            <GatsbyImage
              placeholder="blurred"
              imgStyle={imgStyle}
              image={getImage(node.frontmatter.image1)}
              alt={"image 1"}
            />
          </Box>
        </Grid>
      </Box>
      {/* Section 2 */}
      <Box
        sx={{ ...sectionWrapperStyle, backgroundColor: "primary" }}
        color="white"
      >
        <Grid
          columns={[1, null, 2]}
          sx={{ ...sectionFlexStyle, alignItems: "center" }}
        >
          <Box sx={{ mb: [5, 0], mt: [0, 3], order: [2, 2, 1] }}>
            <GatsbyImage
              style={imgWrapStyle}
              imgStyle={imgStyle}
              image={getImage(node.frontmatter.image2)}
              alt={"image 2"}
            />
          </Box>
          <Box sx={{ py: [4, 6], pl: [0, 5], order: [1, 1, 2] }}>
            <Heading as="h2" variant="subheading1" color="white">
              Tech Used
            </Heading>
            <Text
              sx={paragraphStyles}
              dangerouslySetInnerHTML={{
                __html: converter.makeHtml(node.frontmatter.tech),
              }}
            ></Text>
          </Box>
        </Grid>
      </Box>
      {/* Section 3 */}
      <Box
        sx={{ ...sectionWrapperStyle, backgroundColor: "secondary" }}
        backgroundColor="#EEEEEE"
      >
        <Grid
          columns={[1, null, 2]}
          sx={{ ...sectionFlexStyle, alignItems: "center" }}
        >
          <Box sx={{ mb: [5, 0], mt: [0, 3], order: [2, 2, 2] }}>
            <GatsbyImage
              image={getImage(node.frontmatter.image3)}
              imgStyle={imgStyle}
              alt={"image 3"}
            />
          </Box>
          <Box sx={{ py: [4, 6], pr: [0, 5], order: [1, 1, 1] }}>
            <Heading as="h2" variant="subheading1">
              Challenges
            </Heading>
            <Text
              sx={paragraphStyles}
              dangerouslySetInnerHTML={{
                __html: converter.makeHtml(node.frontmatter.challenges),
              }}
            ></Text>
          </Box>
        </Grid>
      </Box>
    </Box>
  );
}

const pageWrapper = {
  width: ["100%"],
  m: "0 auto !important",
  pt: "100px",
  pb: 5,
  minHeight: "300px",
  flexDirection: "column",
  bg: "primary",
  justifyContent: "center",
  alignItems: "center",
  color: "white",
  textAlign: "center",
};

const paragraphStyles = {
  lineHeight: "1.5",
  fontSize: 2,
};

const imgWrapStyle = {
  display: "flex",
  justifyContent: "center",
};

const imgStyle = {
  objectFit: "contain",
  maxWidth: "500px",
};

const sectionWrapperStyle = {
  width: ["100%"],
  mx: "auto",
  textAlign: ["center", "left"],
};

const sectionFlexStyle = {
  width: ["90%", "75%"],
  m: "0 auto !important",
  height: "100%",
  flexWrap: "wrap",
};

export const pageQuery = graphql`
  query ProjectBySlug($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        date
        completeTime
        description
        tech
        challenges
        link
        keywords
        image1 {
          childImageSharp {
            gatsbyImageData
          }
        }
        image2 {
          childImageSharp {
            gatsbyImageData
          }
        }
        image3 {
          childImageSharp {
            gatsbyImageData
          }
        }
      }
    }
  }
`;

export default Project;
