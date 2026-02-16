import { MDXProvider } from "@mdx-js/react";
import { graphql } from "gatsby";
import { useTranslation } from "gatsby-plugin-react-i18next";
import { DateTime } from "luxon";
import { Box, Button, Flex, Heading, Text } from "theme-ui";
import CallToAction from "../components/CallToAction";
import { ProjectSection } from "../components/ProjectSection/ProjectSection";
import Seo from "../components/Seo/Seo";
import { TechListing } from "../components/TechListing/TechListing";
import Layout from "../components/app/Layout";
import globalCodes from "../short-codes";

const shortCodes = { ...globalCodes, ProjectSection, TechListing };

function ProjectPage({ data, children }) {
  const { t } = useTranslation("common");
  const { mdx: node } = data;

  return (
    <Layout>
      <Seo
        title={node.frontmatter.title}
        keywords={node.frontmatter.keywords.split(",")}
        image={node.frontmatter.image1.childImageSharp.original.src}
      />
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
        {(node.frontmatter.status === "ongoing" ||
          node.frontmatter.status === "complete") && (
          <Box
            sx={{
              bg: node.frontmatter.status === "ongoing" ? "orange" : "#81B29A",
              color: "white",
              fontWeight: "bold",
              fontSize: 1,
              px: 3,
              py: 1,
              borderRadius: "20px",
              mt: 1,
              display: "inline-block",
            }}
          >
            {node.frontmatter.status === "ongoing"
              ? t("status_in_progress")
              : t("status_complete")}
          </Box>
        )}
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
    </Layout>
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

export const pageQuery = graphql`
  query ProjectBySlug($slug: String!, $language: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      frontmatter {
        title
        startDate
        endDate
        URL
        githubURL
        status
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

    locales: allLocale(
      filter: { ns: { in: ["common"] }, language: { eq: $language } }
    ) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;

export default ProjectPage;
