/** @jsx jsx */
import { jsx, Box } from "theme-ui";

// STYLES
import "../../css/reset.css";

// COMPONENTS
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { MDXProvider, useMDXComponents } from "@mdx-js/react";
import { useThemedStylesWithMdx } from "@theme-ui/mdx";
import { ThemeUIProvider } from "theme-ui";
import theme from "../../theme/theme";

const Layout = ({ children, components }) => {
  const componentsWithStyles = useThemedStylesWithMdx(
    useMDXComponents(components),
  );
  return (
    <ThemeUIProvider theme={theme}>
      <MDXProvider components={componentsWithStyles}>
        <Helmet>
          {" "}
          <html style="scroll-behavior: smooth" lang="en" />
        </Helmet>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </MDXProvider>
    </ThemeUIProvider>
  );
};

export default Layout;
