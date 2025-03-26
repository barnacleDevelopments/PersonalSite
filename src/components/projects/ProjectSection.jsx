/** @jsx jsx */
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { jsx } from "theme-ui";
import { Box, Grid } from "theme-ui";

export function ProjectSection({
  children,
  image,
  imageAlt,
  alignment = "left",
}) {
  const isLeftAligned = alignment === "left";

  return (
    <Box sx={{ ...sectionWrapperStyle }}>
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
            imgStyle={imgStyle}
            image={getImage(image)}
            alt={imageAlt}
          />
        </Box>
      </Grid>
    </Box>
  );
}

const sectionWrapperStyle = {
  width: ["100%"],
  mx: "auto",
  mb: 5,
  textAlign: ["center", "left"],
};

const imgStyle = {
  objectFit: "contain",
  maxWidth: "500px",
  width: "100%",
};
