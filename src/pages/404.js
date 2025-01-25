import * as React from "react";
import { Link } from "gatsby";
import { Box } from "theme-ui";

const NotFoundPage = () => {
  return (
    <Box
      sx={{
        margin: "0 auto",
        width: ["90%", "80%", "70%"],
        my: 6,
      }}
    >
      <h1>Oups! This page does not exist!</h1>
      <Link href="/">Go Back Home</Link>
    </Box>
  );
};

export default NotFoundPage;
