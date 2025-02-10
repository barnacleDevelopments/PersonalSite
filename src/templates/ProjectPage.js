/** @jsx jsx */
import { jsx, Link } from "theme-ui";
import { graphql } from "gatsby";
import moment from "moment";
import { Box, Flex, Button, Heading, Text, Grid } from "theme-ui";
import Seo from "../components/app/Seo";
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { MDXProvider } from "@mdx-js/react";

function ProjectPageSection({ text, image, imageAlt }) {
  console.log("DEBUG: ", image);
  return (
    <Box
      sx={{ ...sectionWrapperStyle, backgroundColor: "secondary" }}
      backgroundColor="#EEEEEE"
    >
      <Grid
        columns={[1, null, 2]}
        sx={{ ...sectionFlexStyle, alignItems: "center" }}
      >
        <Box sx={{ py: [4, 6], pr: [0, 5], order: [1, 2] }}>
          <Heading as="h2" variant="subheading1">
            Overview
          </Heading>
          <Text sx={paragraphStyles}>{text}</Text>
        </Box>
        <Box sx={{ order: [1, 2], mb: [5, 0], mt: [0, 3] }}>
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

const sectionFlexStyle = {
  width: ["90%", "75%"],
  m: "0 auto !important",
  height: "100%",
  flexWrap: "wrap",
};

const shortCodes = { ProjectPageSection };

function ProjectPage({ data, children }) {
  const { mdx: node } = data;
  console.log(data);
  return (
    <Box>
      <Seo
        title={node.frontmatter.title}
        keywords={node.frontmatter.keywords.split(",")}
        image={node.frontmatter.image1.childImageSharp.original.src}
      ></Seo>
      <MDXProvider components={shortCodes}>{children}</MDXProvider>
      {/* {/\* Hero *\/} */}
      {/* <Flex sx={pageWrapper}> */}
      {/*   <Heading as="h1" variant="hero" color="white"> */}
      {/*     {node.frontmatter.title} */}
      {/*   </Heading> */}
      {/*   <Text */}
      {/*     sx={{ */}
      {/*       my: 2, */}
      {/*       fontSize: 3, */}
      {/*     }} */}
      {/*   > */}
      {/*     {moment(node.frontmatter.startDate).format("MMM Do, YYYY")} */}
      {/*   </Text> */}
      {/*   <Box> */}
      {/*     {" "} */}
      {/*     {node.frontmatter.URL && ( */}
      {/*       <a target="_blanc" href={node.frontmatter.URL}> */}
      {/*         <Button mt={3} variant="primary" mr={2}> */}
      {/*           View */}
      {/*         </Button> */}
      {/*       </a> */}
      {/*     )}{" "} */}
      {/*     {node.frontmatter.githubURL && ( */}
      {/*       <a target="_blanc" href={node.frontmatter.githubURL}> */}
      {/*         <Button mt={3} variant="primary"> */}
      {/*           GitHub Repo */}
      {/*         </Button> */}
      {/*       </a> */}
      {/*     )} */}
      {/*   </Box> */}
      {/* </Flex> */}
      {/* {/\* Section 2 *\/} */}
      {/* <Box */}
      {/*   sx={{ ...sectionWrapperStyle, backgroundColor: "primary" }} */}
      {/*   color="white" */}
      {/* > */}
      {/*   {" "} */}
      {/*   <Grid */}
      {/*     columns={[1, null, 2]} */}
      {/*     sx={{ ...sectionFlexStyle, alignItems: "center" }} */}
      {/*   > */}
      {/*     <Box sx={{ mb: [5, 0], mt: [0, 3], order: [2, 2, 1] }}> */}
      {/*       <GatsbyImage */}
      {/*         style={imgWrapStyle} */}
      {/*         imgStyle={imgStyle} */}
      {/*         image={getImage(node.frontmatter.image2)} */}
      {/*         alt={"image 2"} */}
      {/*       /> */}
      {/*     </Box> */}
      {/*     <Box sx={{ py: [4, 6], pl: [0, 5], order: [1, 1, 2] }}> */}
      {/*       <Heading as="h2" variant="subheading1" color="white"> */}
      {/*         Tech Used */}
      {/*       </Heading> */}
      {/*       <Text sx={paragraphStyles}></Text> */}
      {/*       <Flex sx={{ flexWrap: "wrap", gap: "10px" }}> */}
      {/*         {node.frontmatter.technologies.map((x) => ( */}
      {/*           <Box> */}
      {/*             <Flex sx={{ alignItems: "center" }}> */}
      {/*               <GatsbyImage */}
      {/*                 placeholder="blurred" */}
      {/*                 style={techImageStyle} */}
      {/*                 image={getImage(x.image)} */}
      {/*                 alt={x.name} */}
      {/*               /> */}
      {/*             </Flex> */}
      {/*           </Box> */}
      {/*         ))} */}
      {/*       </Flex> */}
      {/*     </Box> */}
      {/*   </Grid> */}
      {/* </Box> */}
      {/* {/\* Section 3 *\/} */}
      {/* <Box */}
      {/*   sx={{ ...sectionWrapperStyle, backgroundColor: "secondary" }} */}
      {/*   backgroundColor="#EEEEEE" */}
      {/* > */}
      {/*   <Grid */}
      {/*     columns={[1, null, 2]} */}
      {/*     sx={{ ...sectionFlexStyle, alignItems: "center" }} */}
      {/*   > */}
      {/*     <Box sx={{ mb: [5, 0], mt: [0, 3], order: [2, 2, 2] }}> */}
      {/*       <GatsbyImage */}
      {/*         image={getImage(node.frontmatter.image3)} */}
      {/*         imgStyle={imgStyle} */}
      {/*         alt={"image 3"} */}
      {/*       /> */}
      {/*     </Box> */}
      {/*     <Box sx={{ py: [4, 6], pr: [0, 5], order: [1, 1, 1] }}> */}
      {/*       <Heading as="h2" variant="subheading1"> */}
      {/*         Challenges */}
      {/*       </Heading> */}
      {/*       <Text sx={paragraphStyles}></Text> */}
      {/*       <Link href="/projects"> */}
      {/*         <Button variant="primary">Back to Projects</Button> */}
      {/*       </Link> */}
      {/*     </Box> */}
      {/*   </Grid> */}
      {/* </Box> */}
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
        image1 {
          childImageSharp {
            gatsbyImageData
            original {
              src
            }
          }
        }
        image2 {
          childImageSharp {
            gatsbyImageData
            original {
              src
            }
          }
        }
        image3 {
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
`;

export default ProjectPage;
