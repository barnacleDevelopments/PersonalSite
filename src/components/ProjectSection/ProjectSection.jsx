/** @jsx jsx */
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { jsx } from "theme-ui";
import { Box, Grid } from "theme-ui";

const sectionWrapperStyle = {
  width: ["100%"],
  mx: "auto",
  mb: 5,
  textAlign: ["center", "left"],
};

export function ProjectSection({
  children,
  image,
  imageAlt,
  alignment = "left",
}) {
  const isLeftAligned = alignment === "left";

  return (
    <Box as="section" aria-label="Project Section" sx={{ ...sectionWrapperStyle }}>
      <Grid columns={[1, 2]} sx={{ alignItems: "center", gap: 5 }}>
        <Box
          sx={{
            order: [2, isLeftAligned ? 1 : 2],
          }}
        >
          {children}
        </Box>
        <Box
          sx={{
            order: [1, isLeftAligned ? 2 : 1],
          }}
        >
          <GatsbyImage
            placeholder="blurred"
            image={getImage(image)}
            alt={imageAlt}
          />
        </Box>
      </Grid>
    </Box>
  );
}
