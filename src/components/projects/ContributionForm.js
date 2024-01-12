/** @jsx jsx */
import { Link, jsx } from "theme-ui";
import { graphql } from "gatsby";
import React from "react";

// Components
import { Box, Text, Themed, Grid, Input } from "theme-ui";
import { useContext, useEffect, useState } from "react";

const ContributionForm = ({ onInput }) => {
  const [input, setInput] = useState("");

  useEffect(() => {
    onInput(input);
  }, [input]);

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
      <Themed.h2 sx={{ textAlign: "center", mb: 4 }}>
        Enter Your Contribution
      </Themed.h2>

      <Input
        sx={{
          width: "100%",
          mb: 3,
          textAlign: "center",
        }}
        onChange={(e) => setInput(e.target.value)}
        value={input}
        placeholder="Enter your contribution"
      ></Input>
    </Box>
  );
};

export default ContributionForm;
