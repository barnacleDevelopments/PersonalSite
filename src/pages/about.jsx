import { graphql } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Link, useTranslation } from "gatsby-plugin-react-i18next";
import { useRef, useState } from "react";
import { Box, Grid, Heading, Paragraph } from "theme-ui";

import CallToAction from "../components/CallToAction";
import Seo from "../components/Seo/Seo";
import SkillsChart from "../components/SkillsChart/SkillsChart";
import { TechListing } from "../components/TechListing/TechListing";
import Layout from "../components/app/Layout";
import ProjectDialog from "../components/dialogs/ProjectDialog";

const AboutPage = ({ data }) => {
  const { t } = useTranslation("about");
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
    <Layout>
      <Seo title="About" />
      <Box
        sx={{
          margin: "0 auto",
          width: ["90%", "80%", "70%"],
          my: 5,
        }}
      >
        <Heading as="h1" variant="hero">
          {t("page_title")}
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
              {t("bio_text_1")}
              <Link
                to="/contact"
                sx={{
                  color: "orange",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {t("please_reach_out")}
              </Link>
              {t("bio_text_2")}
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
              {t("tech_experience_title")}
            </Heading>
            <Paragraph sx={{ mb: 4 }}>
              {t("tech_experience_text")}
              <b>{t("tech_experience_click_hint")}</b>.
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
            {t("projects_by_tech_title")}
          </Heading>
          <Paragraph sx={{ mb: 3 }}>{t("projects_by_tech_text")}</Paragraph>
          <SkillsChart technologies={technologies} />
        </Box>
        <CallToAction
          title={t("cta_title")}
          content={t("cta_content")}
          buttonText={t("cta_button")}
          pageLink={"/projects"}
        />
      </Box>
      <ProjectDialog
        ref={dialog}
        title={selectedTechnology?.name}
        projects={selectedTechnology?.projects}
      />
    </Layout>
  );
};

export const aboutPageQuery = graphql`
  query AboutPageQuery($language: String!) {
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

    locales: allLocale(
      filter: { ns: { in: ["common", "about"] }, language: { eq: $language } }
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

export default AboutPage;
