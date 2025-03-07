/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import { GatsbyImage, getImage, StaticImage } from "gatsby-plugin-image";
import { Button, Flex, Box, Grid, Link, Heading } from "theme-ui";
import Seo from "../components/app/Seo";
import Loader from "../components/Loader";
import PostCard from "../components/blog/PostCard";
import CallToAction from "../components/CallToAction";
import ProjectCard from "../components/projects/ProjectCard";
import BookCard from "../components/books/BookCard";
import LoadablePortfolioScene from "../components/PortfolioScene";

export default function VrIndex({ data }) {
  const projects = data.projects.edges.map(({ node }) => ({
    ...node.frontmatter,
    ...node.fields,
  }));
  console.log(projects);

  return (
    <Box>
      <h1>Welcome to My 3D Portfolio</h1>
      <LoadablePortfolioScene projects={projects} />
    </Box>
  );
}

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
