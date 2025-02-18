/** @jsx jsx */
import { jsx, Box } from "theme-ui";

export function CloseButton(onClick) {
  return (
    <Box
      onClick={(e) => onClick(e)}
      href="/"
      sx={{
        position: "relative",
        height: "30px",
        width: "30px",
        cursor: "pointer",
      }}
    >
      <Box
        sx={{
          bg: "primary",
          position: "absolute",
          height: "5px",
          width: "30px",
          transform: "rotate(45deg)",
          transformOrigin: "center",
          top: "13px",
          left: "0px",
        }}
      ></Box>
      <Box
        sx={{
          bg: "primary",
          position: "absolute",
          height: "5px",
          width: "30px",
          transform: "rotate(-45deg)",
          top: "13px",
          left: "0px",
        }}
      ></Box>
    </Box>
  );
}
