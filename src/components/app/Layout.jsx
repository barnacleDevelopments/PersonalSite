/** @jsx jsx */
import { jsx } from "theme-ui";
import React from "react";
// STYLES
import "../../css/reset.css";

// COMPONENTS
import Navbar from "./Navbar";
import Footer from "./Footer";
import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { useThemedStylesWithMdx } from "@theme-ui/mdx";
import { ThemeUIProvider } from "theme-ui";
import theme from "../../theme/theme";
import Prism from '@theme-ui/prism'

const components = {
  pre: ({ children }) => <>{children}</>,
  code: Prism,
}

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
