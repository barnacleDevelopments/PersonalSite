require("./src/css/prismjs.css");

// Scroll to top on every route change
exports.shouldUpdateScroll = () => {
  window.scrollTo(0, 0);
  return false;
};
