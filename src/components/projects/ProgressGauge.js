/** @jsx jsx */
import { Heading, jsx } from "theme-ui";
import React from "react";
import { useEffect, useState } from "react";

// Components
import { Text, Box, Flex } from "theme-ui";

const ProgressGauge = ({ maxProgress = 100, currentProgress = 0 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (currentProgress > 0) {
      const p = currentProgress / maxProgress;
      setProgress(p * 100);
    }
  }, [currentProgress]);

  return (
    <Box
      as="section"
      className="progress-container"
      sx={{
        backgroundColor: "primary",
        mt: [3, 4],
        color: "white",
        p: 5,
        pt: 4,
        pb: 5,
        borderRadius: "10px",
      }}
    >
      <Heading as="h2" sx={{ textAlign: "center", mb: 1 }}>
        Current Prize Balance
      </Heading>
      <Flex sx={{ justifyContent: "center" }}>
        <Text variant="regular" sx={{ color: "white" }}>
          {currentProgress} ETH
        </Text>
      </Flex>
      <Box
        sx={{
          width: "100%",
          height: "20px",
          position: "relative",
          mt: 3,
        }}
      >
        <Box
          as="progress"
          value={progress}
          max="100"
          sx={{
            width: "100%",
            height: "100%",
            color: "orange",
            transition: "width 0.5s ease-out",
          }}
        ></Box>
        <Box
          sx={{
            display: ["none", "block"],
          }}
        >
          {[...Array(6)].map((x, i) => {
            const segment = `${((maxProgress / 5) * i).toFixed(4)} eth`;

            return (
              <React.Fragment key={i}>
                {i != 0 && i != 5 && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: `${(i * 100) / 5}%`,
                      top: 0,
                      bottom: 0,
                      borderLeft: "2px solid white",
                    }}
                  ></Box>
                )}
                <Box
                  sx={{
                    position: "absolute",
                    left: `${(i * 100) / 5}%`,
                    top: "25px",
                    fontSize: "10px",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {segment}
                </Box>
              </React.Fragment>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default ProgressGauge;
