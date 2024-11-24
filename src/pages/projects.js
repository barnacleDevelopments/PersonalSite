/** @jsx jsx */
import { Link, Paragraph, Progress, jsx } from "theme-ui";
import { graphql } from "gatsby";
import ProjectCard from "../components/projects/ProjectCard";
import { Box, Heading, Button, Flex, Text } from "theme-ui";
import Seo from "../components/app/Seo";
import WalletBanner from "../components/projects/WalletBanner";
import CallToAction from "../components/CallToAction";
import Dialog from "../components/dialog";

const ProjectsPage = ({ data }) => {
  const projects = data.allMarkdownRemark.edges.map(
    ({ node: { fields, frontmatter } }) => ({
      ...fields,
      ...frontmatter,
    }),
  );

  return (
    <Box>
      <Seo title="Projects" />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          mt: "60px",
          my: 6,
        }}
      >
        <Box as="section" sx={{ mb: 4, mt: 4 }}>
          <Heading as="h1" variant="hero">
            Projects
          </Heading>
          <Paragraph variant="large">
            Discover a selection of my latest projects. If you're interested in
            collaboration or want to learn more, feel free to{" "}
            <Link href="/contact">contact me</Link>.
          </Paragraph>
        </Box>
        <Box
          as="section"
          sx={{
            mb: 3,
          }}
        >
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </Box>
        <CallToAction
          title={"Interested in collaborating?"}
          content={
            "I'd love to hear from you and explore how we can work together."
          }
          buttonText={"Get in Touch"}
          pageLink={"/contact"}
        />
      </Box>
    </Box>
  );
};

export const projectsQuery = graphql`
  query ProjectsPageQuery {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "//projects//" } }
      sort: { frontmatter: { startDate: DESC } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            image1
            description
            startDate(formatString: "MMMM, YYYY")
          }
        }
      }
    }
  }
`;

export default ProjectsPage;
