/** @jsx jsx */
import { Link, Paragraph, jsx } from "theme-ui";

// COMPONENTS
import { Box, Heading, Grid } from "theme-ui";
import Seo from "../components/app/Seo";
import { StaticImage } from "gatsby-plugin-image";
import CallToAction from "../components/CallToAction";
import { graphql } from "gatsby";
import { TechListing } from "../templates/ProjectPage";
import { useEffect, useState } from "react";

const AboutPage = ({ data }) => {
  const allProjects = data.allMdx.edges;

  const technologyMap = new Map();
  allProjects.forEach(({ node }) => {
    const { title, technologies } = node.frontmatter;
    const { slug } = node.fields;

    technologies.forEach((tech) => {
      if (!technologyMap.has(tech.name)) {
        technologyMap.set(tech.name, {
          image: tech.image,
          slug,
          projects: [],
        });
      }
      technologyMap.get(tech.name).projects.push({ title, slug });
    });
  });

  const technologies = Array.from(technologyMap, ([name, data]) => ({
    name,
    image: data.image,
    projects: data.projects,
  }));

  const [technologiesDynamic, setTechnologies] = useState(technologies);
  const [selectedTechnology, setSelectedTechnology] = useState(technologies[0]);

  useEffect(() => {
    console.log(technologiesDynamic);
    console.log(selectedTechnology);
  }, []);

  return (
    <Box>
      <Seo title="About" />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          my: 6,
        }}
      >
        <Heading as="h1" variant="hero">
          A Little More About Me
        </Heading>
        <Grid sx={{ mb: 4 }} gap={3} columns={["1fr", "1fr 1fr", "1.5fr 2fr"]}>
          <Box
            sx={{
              borderRadius: "10px",
              overflow: "hidden",
            }}
          >
            <StaticImage
              style={{ height: "500px" }}
              src="../images/devin_portrait_2.jpg"
              alt="dev portrait"
            />
          </Box>
          <Box>
            <Paragraph variant="regular">
              The software field stands out due to the incredible people I've
              met and the amazing teams we've built. Our field encompasses many
              disciplines, and it's inspiring how we co-operate to achieve
              extraordinary outcomes. I thrive in collaborative environments,
              embracing teamwork to help businesses realize their software
              solutions using the latest web technologies. The challenge of
              technology and its potential to enable new possibilities draws me
              into this ever-expanding field. Whether building a solution,
              gaining deep knowledge on a subject, or increasing my proficiency,
              I am constantly learning. If you couldn't tell, I like to climb
              just about anything I can get my hands on. Naturally, if you don't
              see me at the office, I'm probably at the local bouldering gym.
              Hearing people talk about their passions fires me up. Please reach
              out; I'm always up for a chat!{" "}
              <Link href="/contact">reach out</Link>; I'm always up for a chat!
            </Paragraph>
          </Box>
        </Grid>
        <Box
          sx={{
            px: [0, 3],
            my: 3,
            bg: "primary",
            color: "white",
            p: 4,
            borderRadius: "10px",
            position: "relative",
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <Heading variant="subheading1" sx={{ color: "white" }}>
              Technology Experience
            </Heading>
            <Paragraph sx={{ mb: 4 }}>
              I have a wide range of experience with different technologies.
              Most of my experience is in the JavaScript and .NET Core
              ecosystems. I also have experience within DevOps more specificaly
              in the Azure ecosystem. I adapt quickly to the technology stack
              required for a project and don't limit myself to my current domain
              of experience.{" "}
              <b>
                Try clicking on a skill to view projects where I have used it
              </b>
              .
            </Paragraph>
          </Box>
          <TechListing
            technologies={technologies}
            onClick={setSelectedTechnology}
          />
          <Box
            sx={{
              borderColor: "white",
              borderRadius: 4,
              backgroundColor: "white",
              p: 4,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
          >
            <Box>
              <Heading variant="subheading2">
                {selectedTechnology.name} - Projects
              </Heading>
              <ul>
                {selectedTechnology.projects.map((project) => {
                  return (
                    <li key={project.title} sx={{ mb: 2 }}>
                      <Link href={project.slug}>{project.title}</Link>
                    </li>
                  );
                })}
              </ul>
            </Box>
          </Box>
        </Box>
        <CallToAction
          title={"Checkout Some of my Projects"}
          content={"Every project I take on I take ownership of."}
          buttonText={"Let's Go!"}
          pageLink={"/projects"}
        />
      </Box>
    </Box>
  );
};

export const aboutPageQuery = graphql`
  query AboutPageQuery {
    allMdx(
      filter: {
        internal: { contentFilePath: { regex: "/content/projects/" } }
        frontmatter: { draft: { eq: false } }
      }
    ) {
      edges {
        node {
          frontmatter {
            technologies {
              name
              image {
                childImageSharp {
                  gatsbyImageData
                }
              }
            }
            title
          }
          fields {
            slug
          }
        }
      }
    }
  }
`;

export default AboutPage;
