/** @jsx jsx */
import { jsx, Box, Text } from "theme-ui";

export default function Tooltip({ text }) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-block",
        "&:hover .tooltip": {
          opacity: 1,
          visibility: "visible",
        },
      }}
    >
      <Box
        sx={{
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          border: "2px solid",
          borderColor: "primary",
          color: "primary",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "bold",
          cursor: "help",
        }}
      >
        ?
      </Box>
      <Box
        className="tooltip"
        sx={{
          position: "absolute",
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "primary",
          color: "white",
          padding: 3,
          borderRadius: "8px",
          fontSize: 1,
          width: "280px",
          opacity: 0,
          visibility: "hidden",
          transition: "opacity 0.2s ease, visibility 0.2s ease",
          zIndex: 1000,
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          "&::after": {
            content: '""',
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            border: "6px solid transparent",
            borderTopColor: "primary",
          },
        }}
      >
        <Text sx={{ fontSize: 1, lineHeight: 1.4 }}>{text}</Text>
      </Box>
    </Box>
  );
}
