/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Text } from "theme-ui";
import { Section } from "../app/Section";

export const JudgementGrid = ({
  projects = [],
  judgements = ["Viewed", "Read", "Commented"],
}) => {
  const renderCircles = () => {
    const items = [];
    for (let y = 1; y <= projects.length; y++) {
      for (let x = 1; x <= judgements.length; x++) {
        items.push(
          <Box
            key={`${y}-${x}`}
            sx={{
              width: "25px",
              height: "25px",
              borderRadius: "9999px",
              bg: "orange",
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
    for (let x = 1; x <= judgements.length; x++) {
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
          {`${judgements[x - 1]}`}
        </Box>
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
        </Box>
      );
    }
    return headings;
  };

  return (
    <Section>
      <Text variant="regular" color="white" mb={3}>
        Please take the chance to view, read and comment on each of the
        projects. Doing so will increase your chance of winning the contract
        balance.
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
    </Section>
  );
};
