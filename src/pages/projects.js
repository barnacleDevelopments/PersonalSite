/** @jsx jsx */
import { jsx } from "theme-ui";
import { graphql } from "gatsby";

// Components
import ProjectCard from "../components/cards/ProjectCard";
import Layout from "../components/app/Layout";
import { Box, Text, Themed, Grid } from "theme-ui";
import Seo from "../components/app/Seo";

const ProjectsPage = ({ data }) => {
  const pageData = data.allMarkdownRemark.edges;
  return (
    <Layout>
      <Seo title="Projects" />
      <Box sx={{
        margin: "0 auto",
        width: ["90%", "80%", "70%"],
        my: 5
      }}>
        <Box sx={{ mt: 6, mb: 5 }} textAlign="center">
          <Themed.h1 sx={{
            mb: 3,
            color: "primary",
          }}>Projects</Themed.h1>
          <Text variant="large" sx={{ textAlign: "center" }}>
            Here are a few of my projects! I'm always looking for new projects to work on so 
            <a href="/contact"> let's get in touch</a> or 
            <a href="/services"> try my estimate feature</a>!
            </Text>
        </Box>
        <Grid sx={{
          mb: 6
        }} gap={3} columns={[1, null, 2, 3]} >
          {pageData.map(({ node }, index) => {
            const project = node.frontmatter;
            return (
              <ProjectCard
                image={project.image1}
                title={project.title}
                siteLink={node.fields.slug}
                key={index}
                buttonText={"View"} />
            )
          })}
        </Grid>
      </Box>
    </Layout >
  )
}

export default ProjectsPage;

export const landingPageQuery = graphql`
query ProjectsPageQuery {
  allMarkdownRemark(filter: {fileAbsolutePath: {regex: "//projects//"}}) {
    edges {
      node {
        fields {
          slug
        }
        frontmatter {
          title,
          overLink,
          image1 {
            childImageSharp {
              gatsbyImageData
            }
          },
          description,
        }
      }
    }
  }
}
`