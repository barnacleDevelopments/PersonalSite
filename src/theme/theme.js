const { tailwind } = require("@theme-ui/presets");

module.exports = {
  ...tailwind,
  colors: {
    primary: "#292E29",
    darkOrange: "#9C4A00",
    secondary: "#eeeeee",
    orange: "#FFA630",
    lightOrange: "#FFA63050",
    white: "#f5f5f5",
    blue: "#2A5F6A",
  },
  fonts: {
    body: "'Raleway', sans-serif",
    heading: "'Raleway', sans-serif",
    monospace: "Menlo, monospace",
  },
  fontSizes: [
    "1rem", // 16px (base size)
    "1.125rem", // 18px
    "1.25rem", // 20px
    "1.5rem", // 24px
    "1.875rem", // 28px
    "2.875rem", // 30px
    // Add more sizes as needed
  ],
  fontWeights: {
    body: 400,
    heading: 700,
    bold: 700,
  },
  lineHeights: {
    body: 1.5,
    heading: 1.25,
  },
  text: {
    ...tailwind.text,
    hero: {
      color: "primary",
      fontFamily: "heading",
      lineHeight: "heading",
      fontSize: 5,
      mb: 3,
    },
    subheading1: {
      color: "primary",
      fontFamily: "heading",
      lineHeight: "heading",
      fontSize: 4,
      mb: 3,
    },
    subheading2: {
      color: "primary",
      fontFamily: "heading",
      lineHeight: "heading",
      fontSize: 3,
      mb: 3,
    },
    small: {
      color: "primary",
      fontSize: 1,
      lineHeight: "body",
    },
    regular: {
      color: "primary",
      fontSize: 2,
      lineHeight: "body",
    },
    large: {
      fontSize: 3,
      color: "primary",
      fontWeight: "bold",
      lineHeight: "heading",
    },
  },
  styles: {
    ...tailwind.styles,
    root: {
      fontFamily: "body",
      lineHeight: "body",
      fontWeight: "body",
    },
    h1: {
      fontSize: [5, 6, 7],
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
    h2: {
      fontSize: [4, 5, 6],
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
  },
  headings: {
    h1: {
      fontSize: [5, 6, 7],
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
    h2: {
      fontSize: [4, 5, 6],
      fontFamily: "heading",
      fontWeight: "heading",
      lineHeight: "heading",
    },
  },
  links: {
    text: {
      color: "blue",
      fontWeight: "bold",
      textDecoration: "underline",
      "&:hover": {
        color: "#E07A5F",
        textDecoration: "underline",
      },
      "&:focus": {
        color: "#3D405B",
        outline: "2px solid #3D405B",
        outlineOffset: "2px",
      },
      "&:active": {
        color: "#F2CC8F",
        textDecoration: "none",
      },
    },
    mobileNav: {
      color: "primary",
    },
    footer: {
      color: "white",
      textDecoration: "none",
      a: {
        color: "orange",
      },
      "&:visited": {
        color: "#FFA63050",
      },
      "&:hover": {
        color: "#E07A5F",
        textDecoration: "underline",
      },
      "&:focus": {
        color: "#3D405B",
        outline: "2px solid #3D405B",
        outlineOffset: "2px",
      },
      "&:active": {
        color: "#F2CC8F",
        textDecoration: "none",
      },
    },
    nav: {
      fontFamily: "body",
      fontWeight: "bold",
      color: "#FFFFFF",
      textDecoration: "none",
      "&:hover": {
        color: "#E07A5F",
        textDecoration: "underline",
      },
      "&:focus": {
        color: "#3D405B",
        outline: "2px solid #3D405B",
        outlineOffset: "2px",
      },
      "&:active": {
        color: "#F2CC8F",
        textDecoration: "none",
      },
    },
  },
  cards: {
    project: {
      bg: "primary",
      color: "white",
      padding: 3,
      borderRadius: 3,
    },
  },
  buttons: {
    primary: {
      fontFamily: "body",
      fontWeight: "bold",
      color: "#1A1A1A",
      cursor: "pointer",
      bg: "orange",
      transition: "all 0.3s ease-in-out",
      "&:disabled": {
        color: "gray",
        cursor: "not-allowed",
        backgroundColor: "lightgray",
        boxShadow: "none",
      },
      "&:hover": {
        backgroundColor: "white",
        boxShadow: "0 0 0 2px orange inset",
      },
    },
    secondary: {
      fontFamily: "body",
      fontWeight: "bold",
      cursor: "pointer",
      color: "primary",
      bg: "secondary",
      border: "2px solid transparent",
      transition: "all 0.3s ease-in-out",
      "&:disabled": {
        color: "gray",
        cursor: "not-allowed",
        backgroundColor: "lightgray",
        boxShadow: "none",
      },
    },
    disabled: {},
  },
  inputs: {
    primary: {
      "&:focus": {
        border: "1px solid orange",
      },
    },
  },
  // Define other theme scales such as space, sizes, zIndices, etc., as needed
};
