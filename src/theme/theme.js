const { tailwind } = require('@theme-ui/presets');

module.exports = {
  ...tailwind,
  colors: {
    primary: "#30362F",
    secondary: "#eeeeee",
    orange: "#FFA630",
    lightOrange: '#FFA63050'
  },
  cards: {
    primary: {
      boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
    }
  },
  fonts: {
    body: "'Raleway', sans-serif"
  },
  text: {
    hero: {
      color: "white"
    },
    small: {
      fontSize: [1, 2],
      lineHeight: 1.5
    },
    regular: {
      color: "primary",
      fontSize: [2, 3],
      lineHeight: 1.5

    },
    large: {
      color: "primary",
      fontSize: [3, 4],
      fontWeight: "500",
      lineHeight: 1.5
    }
  },
  links: {
    inline: {

    },
    footLink: {
      color: "white",
      textDecoration: "none",
      '&:hover': {
        color: "orange",
      },
    },
    nav: {
      textDecoration: "none",
      fontSize: "1.5em",
      fontWeight: 400,
      ":hover": {
        color: "orange"
      },
    }
  },
  buttons: {
    primary: {
      fontFamily: "'Raleway', sans-serif",
      color: "white",
      bg: "orange",
      border: "2px solid orange",
      textTransform: "uppercase",
      boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "1.010em",
      display: "inline-block",
      textAlign: "center",
      borderRadius: "0px",
      width: "max-content",
      cursor: "pointer",
      '&:hover': {
        bg: "white",
        color: "orange"
      }
    },
    secondary: {
      fontFamily: "'Raleway', sans-serif",
      backgroundColor: "secondary",
      color: "black",
      border: "2px solid",
      borderRadius: "0px",
      borderColor: "secondary",
      textTransform: "uppercase",
      boxShadow: "rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px",
      textDecoration: "none",
      fontWeight: "bold",
      fontSize: "1.010em",
      display: "inline-block",
      textAlign: "center",
      width: "max-content",
      cursor: "pointer",
      '&:hover': {
        bg: "primary",
        color: "white"
      }
    }
  },
  styles: {
    root: {
      fontFamily: 'body',
      lineHeight: 'body',
      fontWeight: 'body',
      m: 0
    },
    h1: {
      fontSize: [5, 6, 7],
      fontWeight: 'bold',
      m: 0
    },
    h2: {
      fontSize: [5, 5, 5, 6],
      m: 0
    },
    h3: {
      fontSize: [4, 5, 5, 5],
      m: 0
    },
    h4: {
      fontSize: 3,
    }
  }

}