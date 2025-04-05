import React from "react";
import { Box } from "theme-ui";

function ImageWrapper({children}) {
  return (
    <Box sx={{mb: 3}}>
      {children}
    </Box>

  )
}

export default ImageWrapper;
