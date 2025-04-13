/** @jsx jsx */
import { jsx, Box } from "theme-ui";
import PropTypes from "prop-types";

export const Section = ({ children }) => {
  return (
    <Box
      p={4}
      mt={4}
      sx={{
        backgroundColor: "primary",
        borderRadius: "10px",
        overflow: "hidden",
      }}
    >
      {children}
    </Box>
  );
};

Section.propTypes = {
  children: PropTypes.node.isRequired,
};
