require("./src/css/prismjs.css");
const React = require("react");
const Layout = require("./src/components/app/Layout").default;

// in gastby-browser.js
exports.shouldUpdateScroll = ({ routerProps: { location } }) => {
  const { pathname } = location;
  // list of routes for the scroll-to-top-hook
  const scrollToTopRoutes = [`/projects`, `/contact`];
  // if the new route is part of the list above, scroll to top (0, 0)
  if (scrollToTopRoutes.indexOf(pathname) !== -1) {
    window.scrollTo(0, 0);
  }

  return false;
};

exports.wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
