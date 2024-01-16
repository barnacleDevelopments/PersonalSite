/** @jsx jsx */
import { jsx } from "theme-ui";

// Components
import { Box, Text, Themed, Input, Field, Button } from "theme-ui";
import { useEffect, useState } from "react";

const ContributionForm = ({ onContributionInput, onNameInput }) => {
  const [contributionValid, setContributionValid] = useState(false);
  const [contributionAmount, setContributionAmount] = useState();
  const [contributionAmountTouched, setContributionAmountTouched] =
    useState(false);

  const [contributerName, setContributerName] = useState("");
  const [contributerNameValid, setContributerNameValid] = useState(false);
  const [contributerNameTouched, setContributerNameTouched] = useState(false);

  useEffect(() => {
    onContributionInput(contributionAmount);
    onNameInput(contributerName);
    const amount = Number.parseFloat(contributionAmount);
    setContributionValid(amount >= 0.001 && amount <= 0.05);
    setContributerNameValid(contributerName.length > 0);
  }, [contributionAmount, contributerName]);

  return (
    <Box
      sx={{
        backgroundColor: "primary",
        mt: 4,
        color: "white",
        p: 5,
        pt: 5,
        pb: 5,
        borderRadius: "10px",
      }}
    >
      <Field
        label="Display Name"
        sx={{
          width: "100%",
          mt: 2,
          mb: 3,
          textAlign: "left",
        }}
        onBlur={() => setContributerNameTouched(true)}
        onChange={(e) => setContributerName(e.target.value)}
        value={contributerName}
        placeholder="Enter your display name"
      ></Field>{" "}
      <div
        style={{ alignItems: "center", width: "100%", position: "relative" }}
      >
        <Field
          label="Contribution Amount"
          sx={{
            width: "100%",
            textAlign: "left",
            mt: 2,
            flex: 1, // Adjust the field to take up available space
          }}
          type="number"
          onBlur={() => setContributionAmountTouched(true)}
          onChange={(e) => setContributionAmount(e.target.value)}
          value={contributionAmount}
          placeholder="Enter your contribution"
        ></Field>
        <Button
          style={{
            marginLeft: "10px",
            position: "absolute",
            right: "8px",
            top: "33px",
            border: "1.2px solid white",
            borderRadius: "3px",
            backgroundColor: "transparent",
            color: "white",
            ":hover": {
              backgroundColor: "white",
            },
            fontSize: "12px",
            paddingTop: "3px",
            paddingBottom: "3px",
            paddingLeft: "4px",
            paddingRight: "4px",
            "::-webkit-inner-spin-button, ::-webkit-outer-spin-button": {
              WebkitAppearance: "none !important",
              margin: 0,
            },
            "::-moz-focus-inner": {
              MozAppearance: "textfield",
              margin: 0,
            },
            "::-ms-clear": {
              display: "none !important",
            },
          }}
          onClick={() => setContributionAmount(0.05)}
        >
          Max
        </Button>
      </div>{" "}
      {!contributionValid && contributionAmountTouched && (
        <Text variant="small" sx={{ textAlign: "center", color: "red" }}>
          Please enter your contribution in ETH between 0.001 and 0.05 ETH.
        </Text>
      )}
      {!contributerNameValid && contributerNameTouched && (
        <Text variant="small" sx={{ textAlign: "center", color: "red" }}>
          Please enter your display name.
        </Text>
      )}
    </Box>
  );
};

export default ContributionForm;
