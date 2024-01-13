/** @jsx jsx */
import { Link, jsx } from "theme-ui";
import { graphql } from "gatsby";
import React from "react";

// Components
import { Box, Text, Themed, Grid, Input } from "theme-ui";
import { useContext, useEffect, useState } from "react";

const ContributionForm = ({ onInput }) => {
  const [input, setInput] = useState("");
  const [inputValid, setInputValid] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    onInput(input);
    const amount = Number.parseFloat(input);
    setInputValid(amount >= 0.001 && amount <= 0.05);
  }, [input]);

  console.log(touched);
  console.log("Input Valid: ", inputValid);

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
          mt: 3,
          mb: 3,
          textAlign: "center",
        }}
        onBlur={() => setTouched(true)}
        onChange={(e) => setInput(e.target.value)}
        value={input}
        placeholder="Enter your contribution"
      ></Input>{" "}
      {!inputValid && touched && (
        <Text variant="small" sx={{ textAlign: "center", color: "red" }}>
          Please enter your contribution in ETH between 0.001 and 0.05 ETH.
        </Text>
      )}
    </Box>
  );
};

export default ContributionForm;
