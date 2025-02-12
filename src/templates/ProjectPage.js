/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";
import moment from "moment";
import { Box, Flex, Button, Heading, Text, Grid } from "theme-ui";
import Seo from "../components/app/Seo";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { MDXProvider } from "@mdx-js/react";

function ProjectPageSection({ children, image, imageAlt, alignment = "left" }) {
  const isLeftAligned = alignment === "left";

  return (
    <Box sx={{ ...sectionWrapperStyle }}>
      <Grid columns={[1, 2]} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            order: [2, isLeftAligned ? 1 : 2],
          }}
        >
          {children}
        </Box>
        <Box
          sx={{
            order: [1, isLeftAligned ? 2 : 1],
          }}
        >
          <GatsbyImage
            placeholder="blurred"
            imgStyle={imgStyle}
            image={getImage(image)}
            alt={imageAlt}
          />
        </Box>
      </Grid>
    </Box>
  );
}

function TechListing({ technologies }) {
  return (
    <Flex sx={{ flexWrap: "wrap", gap: "10px" }}>
      {technologies.map((x) => (
        <Box>
          <Flex sx={{ alignItems: "center" }}>
            <GatsbyImage
              placeholder="blurred"
              style={techImageStyle}
              image={getImage(x.image)}
              alt={x.name}
            />
          </Flex>
        </Box>
      ))}
    </Flex>
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

const shortCodes = { ProjectPageSection, TechListing };

function ProjectPage({ data, children }) {
  const { mdx: node } = data;

  return (
    <Box sx={{ backgroundColor: "secondary" }}>
      <Seo
        title={node.frontmatter.title}
        keywords={node.frontmatter.keywords.split(",")}
        image={node.frontmatter.image1.childImageSharp.original.src}
      ></Seo>
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
                View
              </Button>
            </a>
          )}{" "}
          {node.frontmatter.githubURL && (
            <a target="_blanc" href={node.frontmatter.githubURL}>
              <Button mt={3} variant="primary">
                GitHub Repo
              </Button>
            </a>
          )}
        </Box>
      </Flex>
      <Box
        sx={{
          width: ["90%", "80%", "70%"],
          mx: "auto",
          my: 6,
        }}
      >
        <MDXProvider components={shortCodes}>{children}</MDXProvider>
      </Box>
    </Box>
  );
}

export const pageQuery = graphql`
  query ProjectBySlug($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
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
        image1 {
          childImageSharp {
            original {
              src
            }
          }
        }
      }
    }
  }
`;

export default ProjectPage;
