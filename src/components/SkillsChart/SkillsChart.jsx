import { useState } from "react";
import { Box, Flex, Text } from "theme-ui";

const SkillsChart = ({ technologies, maxItems = 10 }) => {
  const [hoveredTech, setHoveredTech] = useState(null);

  const sorted = [...technologies]
    .sort((a, b) => b.projects.length - a.projects.length)
    .slice(0, maxItems);

  const maxCount = sorted[0]?.projects.length || 1;

  return (
    <Box sx={{ width: "100%" }}>
      {sorted.map((tech) => {
        const percentage = (tech.projects.length / maxCount) * 100;
        const isHovered = hoveredTech === tech.name;
        const isDimmed = hoveredTech !== null && !isHovered;

        return (
          <Flex
            key={tech.name}
            onMouseEnter={() => setHoveredTech(tech.name)}
            onMouseLeave={() => setHoveredTech(null)}
            sx={{
              alignItems: "center",
              mb: 2,
              gap: 2,
              opacity: isDimmed ? 0.4 : 1,
              transition: "opacity 0.2s ease",
              cursor: "pointer",
            }}
          >
            <Text
              sx={{
                width: ["80px", "100px", "120px"],
                fontSize: [0, 1],
                fontWeight: "bold",
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              {tech.name}
            </Text>
            <Box
              sx={{
                flex: 1,
                height: "24px",
                bg: "rgba(255,255,255,0.2)",
                borderRadius: "4px",
                overflow: "hidden",
              }}
            >
              <Box
                sx={{
                  width: `${percentage}%`,
                  height: "100%",
                  bg: isHovered ? "orange" : "secondary",
                  borderRadius: "4px",
                  transition: "width 0.5s ease, background-color 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  px: 2,
                }}
              >
                <Text
                  sx={{
                    fontSize: 0,
                    fontWeight: "bold",
                    color: "primary",
                  }}
                >
                  {tech.projects.length}
                </Text>
              </Box>
            </Box>
          </Flex>
        );
      })}
    </Box>
  );
};

export default SkillsChart;
