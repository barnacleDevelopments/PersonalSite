/** @jsx jsx */
import { jsx } from "theme-ui";
import { Link, Box, Text } from "theme-ui";
import { Section } from "../app/Section";
import { useEffect, useState, useContext } from "react";

// Functions
import { getActionCIDs } from "../../functions/project-voting";
import { WalletContext } from "../../contexts/WalletContext";

export const JudgementGrid = ({
  projects = [],
  judgments = ["view", "read", "comment"],
}) => {
  const [projectActions, setProjectActions] = useState([]);
  const walletContext = useContext(WalletContext);

  useEffect(() => {
    const init = async () => {
      // await updateActions();
    };
    init();
  }, [projects.length]);

  // const updateActions = async () => {
  //   if (walletContext?.walletAddress) {
  //     const actionCIDs = await getActionCIDs(walletContext?.walletAddress);
  //     const actions = await getRecords(actionCIDs);
  //     console.log(actions);
  //     if (actions.length > 0) {
  //       const result = projects.map((project) => {
  //         for (const action of actions) {
  //           if (project.id === action.projectId) {
  //             project.actionType = action.type;
  //           }
  //         }
  //         return project;
  //       });
  //       setProjectActions(result);
  //     }
  //   }
  // };

  const renderCircles = () => {
    const items = [];
    for (let y = 1; y <= projectActions.length; y++) {
      for (let x = 1; x <= judgments.length; x++) {
        // console.log(judgements[x - 1]);
        // console.log(projectActions[y - 1]);

        items.push(
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
        projects. Each action will prompt a signature from you to confirm you
        completed it. These signatures will be stored on the{" "}
        <Link
          href="https://docs.ipfs.tech/concepts/what-is-ipfs/"
          target="_blanc"
        >
          Interplanetary File System (IPFS)
        </Link>
        . They will be later referenced by the{" "}
        <Link href="">Project Voting</Link> smart contract to increase your
        winning probability. Each action will increase your chance of winning by
        0.5%.
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
