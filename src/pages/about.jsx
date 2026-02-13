import { Link as GatsbyLink, graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { useRef, useState } from "react";
import { Box, Grid, Heading, Paragraph } from "theme-ui";

import CallToAction from "../components/CallToAction";
import Seo from "../components/Seo/Seo";
import SkillsChart from "../components/SkillsChart/SkillsChart";
import { TechListing } from "../components/TechListing/TechListing";
import ProjectDialog from "../components/dialogs/ProjectDialog";

const AboutPage = ({ data }) => {
  const dialog = useRef(null);
  const [selectedTechnology, setSelectedTechnology] = useState();

  const allProjects = data.allMdx.edges;

  const technologyMap = new Map();
  for (const { node } of allProjects) {
    const { title, technologies } = node.frontmatter;
    const { slug } = node.fields;

    for (const tech of technologies) {
      if (!technologyMap.has(tech.name)) {
        technologyMap.set(tech.name, {
          image: tech.image,
          slug,
          projects: [],
        });
      }
      technologyMap.get(tech.name).projects.push({ title, slug });
    }
  }

  const technologies = Array.from(technologyMap, ([name, data]) => ({
    name,
    image: data.image,
    projects: data.projects,
  }));

  return (
    <Box>
      <Seo title="About" />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          my: 5,
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
              Hearing people talk about their passions fires me up.{" "}
              <GatsbyLink
                to="/contact"
                sx={{
                  color: "orange",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                Please reach out
              </GatsbyLink>
              ; I'm always up for a chat!{" "}
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
            onClick={(technology) => {
              dialog.current.showModal();
              setSelectedTechnology(technology);
            }}
          />
        </Box>
        <Box
          sx={{
            px: [0, 3],
            my: 3,
            bg: "primary",
            color: "white",
            p: 4,
            borderRadius: "10px",
          }}
        >
          <Heading variant="subheading1" sx={{ color: "white", mb: 2 }}>
            Projects by Technology
          </Heading>
          <Paragraph sx={{ mb: 3 }}>
            I don't find skill levels particularly measurable, but I want to
            provide context into where I've used different technologies. My
            proficiency is based on real project experience.
          </Paragraph>
          <SkillsChart technologies={technologies} />
        </Box>
        <CallToAction
          title={"Checkout Some of my Projects"}
          content={"Every project I take on I take ownership of."}
          buttonText={"Let's Go!"}
          pageLink={"/projects"}
        />
      </Box>
      <ProjectDialog
        ref={dialog}
        title={selectedTechnology?.name}
        projects={selectedTechnology?.projects}
      />
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
