/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";
import { Box, Flex, Button, Heading, Text, Grid } from "theme-ui";
import Seo from "../components/app/Seo";
import { MDXProvider } from "@mdx-js/react";
import CallToAction from "../components/CallToAction";
import { DateTime } from "luxon";
import { TechListing } from "../components/projects/TechListing";
import { ProjectSection } from "../components/projects/ProjectSection";

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

const shortCodes = { ProjectSection, TechListing };

function ProjectPage({ data, children }) {
  const { mdx: node } = data;

  return (
    <Box>
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
          {DateTime.fromISO(node.frontmatter.startDate).toFormat("MMM d, yyyy")}
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
        <CallToAction
          sx={{ mt: 5 }}
          title="Thanks for checking out my project!"
          content="Explore some of my other projects and see what I've been working on."
          buttonText="Explore"
          pageLink="/projects"
        />
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
