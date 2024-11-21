/** @jsx jsx */
import { jsx, Box } from "theme-ui";

// STYLES
import "../../css/reset.css";

// COMPONENTS
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </Box>
  );
};

export default Layout;
