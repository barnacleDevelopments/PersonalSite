/** @jsx jsx */
import { jsx, Box } from "theme-ui";

// STYLES
import "../../css/reset.css";

// COMPONENTS
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Helmet } from "react-helmet";

const Layout = ({ children }) => {
  return (
    <Box>
      <Helmet>
        {" "}
        <html lang="en" />
      </Helmet>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </Box>
  );
};

export default Layout;
