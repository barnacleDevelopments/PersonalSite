const { tailwind } = require("@theme-ui/presets");

module.exports = {
  ...tailwind,
  colors: {
    ...tailwind.colors,
    primary: "#30362F",
    secondary: "#eeeeee",
    orange: "#FFA630",
    lightOrange: "#FFA63050",
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
    a: {
      color: "#FFA630",
      textDecoration: "none",
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
    footer: {
      color: "white",
      textDecoration: "none",
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
  buttons: {
    primary: {
      fontFamily: "body",
      fontWeight: "bold",
      color: "white",
      cursor: "pointer",
      bg: "orange",
      transition: "all 0.3s ease-in-out",
      "&:hover": {
        backgroundColor: "white",
        color: "orange",
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
      "&:hover": {
        color: "white",
        backgroundColor: "orange",
        borderColor: "orange",
      },
    },
  },

  // Define other theme scales such as space, sizes, zIndices, etc., as needed
};
