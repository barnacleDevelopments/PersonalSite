/** @jsx jsx */
import { GatsbyImage, getImage } from "gatsby-plugin-image";
import { jsx } from "theme-ui";
import { Flex, Button } from "theme-ui";

export function TechListing({ technologies, onClick, descriptive = true }) {
  return (
    <Flex sx={{ flexWrap: "wrap", gap: "10px" }}>
      {onClick
        ? technologies.map((x) => (
            <Button variant="secondary">
              <Flex
                sx={{
                  cursor: "pointer",
                  alignItems: "center",
                  gap: 2,
                }}
                onClick={() => onClick(x)}
                key={x.name}
              >
                <GatsbyImage
                  placeholder="blurred"
                  style={techImageStyle}
                  image={getImage(x.image)}
                  alt={x.name}
                />
                {descriptive && x.name}
              </Flex>
            </Button>
          ))
        : technologies.map((x) => (
            <Flex
              sx={{
                alignItems: "center",
                gap: 2,
              }}
              key={x.name}
            >
              <GatsbyImage
                placeholder="blurred"
                style={techImageStyle}
                image={getImage(x.image)}
                alt={x.name}
              />
              {descriptive && x.name}
            </Flex>
          ))}
    </Flex>
  );
}

const techImageStyle = {
  width: "20px",
  mr: 1,
  mb: 2,
};
