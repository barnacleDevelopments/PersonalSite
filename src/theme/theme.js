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
  fontSizes: [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72],
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
      color: "background",
      bg: "primary",
      fontFamily: "heading",
      lineHeight: "heading",
    },
    small: {
      fontSize: 1,
      lineHeight: "body",
    },
    regular: {
      fontSize: 2,
      lineHeight: "body",
    },
    large: {
      fontSize: 3,
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
      color: "orange",
      "&:visited": {
        color: "lightOrange",
      },
    },
    h1: {
      fontSize: [5, 6, 7], // Responsive font sizes
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
    // Additional heading styles (h3, h4) go here...
  },
  buttons: {
    primary: {
      fontFamily: "body",
      fontWeight: "bold",
      color: "white",
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
