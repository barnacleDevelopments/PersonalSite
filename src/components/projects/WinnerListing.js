/** @jsx jsx */
import { jsx } from "theme-ui";
import React from "react";
import { Text, Themed, Box, Flex } from "theme-ui";
import { useEffect, useState } from "react";

const WinnerList = ({ winners = [] }) => {
  return (
    <Box
      sx={{
        backgroundColor: "primary",
        mt: 4,
        color: "white",
        p: 5,
        pt: 4,
        pb: 5,
        borderRadius: "10px",
      }}
    >
      <Themed.h2 sx={{ textAlign: "center" }}>Winner List</Themed.h2>
      <Box variant="list" sx={{ textAlign: "center", mt: 3 }}>
        {winners.map((winner) => (
          <React.Fragment key={winner}>
            <Text variant="regular" sx={{ color: "white" }}>
              {winner}
            </Text>
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

export default WinnerList;
