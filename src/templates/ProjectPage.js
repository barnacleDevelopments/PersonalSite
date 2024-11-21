/** @jsx jsx */
import { jsx, Link } from "theme-ui";
import { graphql } from "gatsby";
import showdown from "showdown";
import moment from "moment";
// Components
import { Box, Flex, Button, Heading, Text, Grid } from "theme-ui";
import Seo from "../components/app/Seo";

function ProjectPage({ data }) {
  const { markdownRemark: node } = data;
  const converter = new showdown.Converter();
  return (
    <Box>
      <Seo
        title={node.frontmatter.title}
        keywords={node.frontmatter.keywords.split(",")}
      >
        <meta property="og:image" content={node.frontmatter.image1} />
        <meta property="twitter:image" content={node.frontmatter.image1} />
      </Seo>
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
          {moment(node.frontmatter.startDate).format("MMM Do, YYYY")}
        </Text>
        <Box>
          {" "}
          {node.frontmatter.URL && (
            <a target="_blanc" href={node.frontmatter.URL}>
              <Button mt={3} variant="primary" mr={2}>
                View Live Site
              </Button>
            </a>
          )}{" "}
          {node.frontmatter.githubURL && (
            <a target="_blanc" href={node.frontmatter.githubURL}>
              <Button mt={3} variant="primary">
                View on GitHub
              </Button>
            </a>
          )}
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
            {/* <GatsbyImage */}
            {/*   placeholder="blurred" */}
            {/*   imgStyle={imgStyle} */}
            {/*   image={getImage(node.frontmatter.image1)} */}
            {/*   alt={"image 1"} */}
            {/* /> */}

            <img sx={imgStyle} src={node.frontmatter.image1} />
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
            {/* <GatsbyImage */}
            {/*   style={imgWrapStyle} */}
            {/*   imgStyle={imgStyle} */}
            {/*   image={getImage(node.frontmatter.image2)} */}
            {/*   alt={"image 2"} */}
            {/* /> */}

            <img sx={imgStyle} src={node.frontmatter.image2} />
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
            <Flex sx={{ flexWrap: "wrap", gap: "10px" }}>
              {node.frontmatter.technologies.map((x) => (
                <Box>
                  <Flex sx={{ alignItems: "center" }}>
                    <img sx={techImageStyle} src={x.image} alt={x.name} />
                    {x.name}
                  </Flex>
                </Box>
              ))}
            </Flex>
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
            {/* <GatsbyImage */}
            {/*   image={getImage(node.frontmatter.image3)} */}
            {/*   imgStyle={imgStyle} */}
            {/*   alt={"image 3"} */}
            {/* /> */}
            <img sx={imgStyle} src={node.frontmatter.image3} />
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
            <Link href="/projects">
              <Button variant="primary">Back to Projects</Button>
            </Link>
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

const techImageStyle = {
  width: "30px",
  mr: 1,
  mb: 2,
};

const imgWrapStyle = {
  display: "flex",
  justifyContent: "center",
};

const imgStyle = {
  objectFit: "contain",
  maxWidth: "500px",
  width: "100%",
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
        startDate
        endDate
        description
        tech
        challenges
        URL
        githubURL
        keywords
        technologies {
          name
          image
        }
        image1
        image2
        image3
      }
    }
  }
`;

export default ProjectPage;
