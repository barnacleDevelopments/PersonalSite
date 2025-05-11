/** @jsx jsx */
import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { useThemedStylesWithMdx } from "@theme-ui/mdx";
import Prism from "@theme-ui/prism";
import { jsx, ThemeUIProvider } from "theme-ui";

import Footer from "./Footer.jsx";
import Navbar from "./Navbar.jsx";
import theme from "../../theme/theme";

import "../../css/reset.css";

const components = {
  pre: ({ children }) => <>{children}</>,
  code: Prism,
};

const Layout = ({ children }) => {
  const componentsWithStyles = useThemedStylesWithMdx(
    useMDXComponents(components),
  );
  return (
    <ThemeUIProvider theme={theme}>
      <MDXProvider components={componentsWithStyles}>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </MDXProvider>
    </ThemeUIProvider>
  );
};

export default Layout;
