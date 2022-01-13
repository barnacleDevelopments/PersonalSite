/** @jsx jsx */
import { jsx } from "theme-ui"

// STYLES
import "../../css/reset.css"
// COMPONENTS
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  )
}

export default Layout;