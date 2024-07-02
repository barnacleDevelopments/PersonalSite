/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Text, Link } from "theme-ui";
import { useEffect, useState, useContext } from "react";

// Functions
import { WalletContext } from "../../contexts/WalletContext";

export const JudgementGrid = ({
  projects = [],
  judgments = ["view", "read", "comment"],
}) => {
  const [projectActions, setProjectActions] = useState([]);
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    const init = async () => {};
    init();
  }, [projects.length]);

  const renderCircles = () => {
    const items = [];
    for (let y = 1; y <= projectActions.length; y++) {
      for (let x = 1; x <= judgments.length; x++) {
        return (
          <Box
            key={`${y}-${x}`}
            sx={{
              width: "25px",
              height: "25px",
              borderRadius: "9999px",
              bg:
                judgments[x - 1] === projectActions[y - 1].actionType
                  ? "orange"
                  : "primary",
              display: "inline-block",
              margin: 2,
            }}
            style={{
              gridColumnStart: x + 1,
              gridRowStart: y + 1,
            }}
          ></Box>
        );
      }
    }
    return items;
  };

  const renderXAxisHeadings = () => {
    const headings = [];
    for (let x = 1; x <= judgments.length; x++) {
      headings.push(
        <Box
          key={`heading-x-${x}`}
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "white",
          }}
          style={{
            gridColumnStart: x + 1,
            gridRowStart: 1,
          }}
        >
          {`${judgments[x - 1]}`}
        </Box>,
      );
    }
    return headings;
  };

  const renderYAxisHeadings = () => {
    const headings = [];
    for (let y = 1; y <= projects.length; y++) {
      headings.push(
        <Box
          key={`heading-y-${y}`}
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "white",
          }}
          style={{
            gridColumnStart: 1,
            gridRowStart: y + 1,
          }}
        >
          {`${projects[y - 1].title}`}
        </Box>,
      );
    }
    return headings;
  };

  return (
    <Box
      as="section"
      sx={{
        backgroundColor: "primary",
        mt: [3],
        color: "white",
        p: [4, 5],
        py: [4, 5],
        borderRadius: "10px",
      }}
    >
      <Text variant="regular" color="white" mb={3}>
        Please take the chance to view, read and comment on each of the
        projects. Doing so will increase your winning probability. Each action
        will increase your chance of winning by 0.5%.
      </Text>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "300px repeat(3, 1fr)",
          gridTemplateRows: "20px repeat(3, 1fr)",
          gridGap: "2px",
          padding: 3,
          placeItems: "center",
          columnWidth: "50px",
        }}
      >
        {renderXAxisHeadings()}
        {renderYAxisHeadings()}
        {renderCircles()}
      </Box>
    </Box>
  );
};
