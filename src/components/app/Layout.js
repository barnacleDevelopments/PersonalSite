/** @jsx jsx */
import { jsx } from "theme-ui";

// STYLES
import "../../css/reset.css";

// COMPONENTS
import Navbar from "./Navbar";
import Footer from "./Footer";
import { WalletProvider } from "../../contexts/WalletContext";

const Layout = ({ children }) => {
  return (
    <WalletProvider>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </WalletProvider>
  );
};

export default Layout;
