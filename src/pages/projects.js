/** @jsx jsx */
import { Link, Paragraph, jsx } from "theme-ui";
import { graphql } from "gatsby";
import ProjectCard from "../components/projects/ProjectCard";
import { Box, Heading } from "theme-ui";
import Seo from "../components/app/Seo";
import CallToAction from "../components/CallToAction";

const ProjectsPage = ({ data }) => {
  const projects = data.allMdx.edges.map(
    ({ node: { fields, frontmatter } }) => ({
      ...fields,
      ...frontmatter,
    }),
  );

  return (
    <Box>
      <Seo
        title="Projects"
        description={`Explore the portfolio of Devin Davis, a results-oriented full-stack developer showcasing web solutions and creative designs. Let's connect to collaborate or discuss new opportunities.`}
        keywords={[
          "Devin Davis",
          "full-stack developer portfolio",
          "web development projects",
          "innovative web solutions",
          "creative web design",
          "frontend development",
          "backend development",
          "JavaScript frameworks",
          "React projects",
          "Angular projects",
          "Vue.js projects",
          "full-stack development",
          "web application development",
          "developer portfolio",
          "software development",
          "collaboration opportunities",
        ]}
      />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          mt: "60px",
          my: 6,
        }}
      >
        <Box as="section" sx={{ mb: 5 }}>
          <Heading as="h1" variant="hero">
            Projects
          </Heading>
          <Paragraph variant="large">
            Discover a selection of my latest projects. If you're interested in
            collaboration or want to learn more, feel free to{" "}
            <Link variant="text" href="/contact">
              contact me
            </Link>
            .
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
    allMdx(
      sort: { frontmatter: { startDate: DESC } }
      filter: { internal: { contentFilePath: { regex: "/content/projects/" } } }
    ) {
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
            startDate(formatString: "MMMM, YYYY")
            image1 {
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

export default ProjectsPage;
