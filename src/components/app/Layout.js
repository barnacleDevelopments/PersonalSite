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
      <main>
        <Navbar />
        {children}
        <Footer />
      </main>
    </WalletProvider>
  );
};

export default Layout;
