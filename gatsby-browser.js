require("./src/css/prismjs.css");
const React = require("react");
const Layout = require("./src/components/app/Layout").default;

// Scroll to top on every route change
exports.shouldUpdateScroll = () => {
  window.scrollTo(0, 0);
  return false;
};

exports.wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
