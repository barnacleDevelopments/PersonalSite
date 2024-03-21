/** @jsx jsx */
import { jsx } from "theme-ui";
import { StaticImage } from "gatsby-plugin-image";
import { useState, useEffect, useContext } from "react";
import SideNav from "./SideNav";
import { Box, Flex, NavLink, Link } from "theme-ui";
import { WalletContext } from "../../contexts/WalletContext";

const Navbar = () => {
  const [navTextColor, setNavTextColor] = useState("");
  const [navTextColorScrolled, setNavTextColorScrolled] = useState("");
  const [navScrollColor, setNavScrollColor] = useState("");
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [sideNavOpen, setSideNavOpen] = useState(false);

  // setup wallet context
  const { hasVoted, isWalletConnected } = useContext(WalletContext);

  const styleNavBar = () => {
    if (window.scrollY < 20) {
      setIsScrolledTop(true);
    } else {
      setIsScrolledTop(false);
    }
  };

  const getPath = () => {
    let path = typeof window !== "undefined" ? window.location.pathname : "";
    return path.replaceAll("/", "");
  };

  const getTextColor = (path) => {
    switch (path) {
      case "services":
        return "#ffffff";
      case "contact":
        return "#ffffff";
      case "team":
        return "#ffffff";
      case "about":
        return "#ffffff";
      default:
        return "#ffffff";
    }
  };

  const getTextScrolled = (path) => {
    switch (path) {
      case "services":
        return "#30362F";
      case "contact":
        return "#30362F";
      case "team":
        return "#30362F";
      case "about":
        return "#30362F";
      default:
        return "#30362F";
    }
  };

  const getScrollColor = (path) => {
    switch (path) {
      case "services":
        return "#ffffff";
      case "contact":
        return "#ffffff";
      case "services":
        return "#ffffff";
      default:
        return "#ffffff";
    }
  };

  function disableScroll() {
    var x = window.scrollX;
    var y = window.scrollY;
    window.onscroll = function () {
      window.scrollTo(x, y);
    };
  }

  function enableScroll() {
    window.onscroll = function () {};
  }

  useEffect(() => {
    const path = getPath();
    const scrollColor = getScrollColor(path);
    const textColor = getTextColor(path);
    const textColorScrolled = getTextScrolled(path);

    setNavScrollColor(scrollColor);
    setNavTextColor(textColor);
    setNavTextColorScrolled(textColorScrolled);

    window.addEventListener("scroll", styleNavBar);

    return function removeScrollListener() {
      window.removeEventListener("scroll", styleNavBar);
    };
  }, []);

  return (
    <Box as="nav">
      <Flex
        sx={navWrapper}
        style={{ backgroundColor: !isScrolledTop ? navScrollColor : null }}
      >
        <SideNav
          isOpen={sideNavOpen}
          setSideNavOpen={setSideNavOpen}
          enableScrollFunc={enableScroll}
        />
        <Box
          sx={{
            width: "90%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: ["none", "block"], color: "white" }}>
            <NavLink
              variant="nav"
              sx={{
                mr: 3,
                color: !isScrolledTop ? navTextColorScrolled : null,
              }}
              href="/blog"
            >
              Blog
            </NavLink>
            <NavLink
              sx={{ color: !isScrolledTop ? navTextColorScrolled : null }}
              href="/contact"
            >
              Contact
            </NavLink>
          </Box>
          {isScrolledTop ? (
            <Link sx={{ width: "60px" }} href="/">
              <Box className="nav-triangle"></Box>
              <Box>
                <StaticImage
                  src="../../images/logo.png"
                  alt="Dev's Webshop Logo"
                />
              </Box>
              <Box className="nav-triangle"></Box>
            </Link>
          ) : (
            <Link sx={{ width: "60px" }} href="/">
              <Box className="nav-triangle"></Box>
              <Box>
                <StaticImage
                  src="../../images/logo_2.png"
                  alt="Dev's Webshop Logo"
                />
              </Box>
              <Box className="nav-triangle"></Box>
            </Link>
          )}
          <Box
            sx={hamburgerStyles}
            onClick={(e) => {
              setSideNavOpen(true);
              disableScroll();
            }}
            href="/"
          >
            <div
              sx={{
                ...hamburderPatty,
                backgroundColor: isScrolledTop
                  ? navScrollColor
                  : navTextColorScrolled,
              }}
            ></div>
            <div
              sx={{
                ...hamburderPatty,
                backgroundColor: isScrolledTop
                  ? navScrollColor
                  : navTextColorScrolled,
              }}
            ></div>
            <div
              sx={{
                ...hamburderPatty,
                backgroundColor: isScrolledTop
                  ? navScrollColor
                  : navTextColorScrolled,
              }}
            ></div>
          </Box>
          <Box sx={{ display: ["none", "block"], color: "white" }}>
            <NavLink
              sx={{
                mr: 3,
                color: !isScrolledTop ? navTextColorScrolled : null,
              }}
              href="/projects"
            >
              Projects
            </NavLink>
            <NavLink
              sx={{ color: !isScrolledTop ? navTextColorScrolled : null }}
              href="/about"
            >
              About
            </NavLink>
          </Box>
        </Box>
        {isWalletConnected && hasVoted ? (
          <Box
            sx={{
              width: "100%",
              height: "18px",
              backgroundColor: "orange",
              display: "block",
            }}
          >
            {" "}
          </Box>
        ) : null}
      </Flex>
    </Box>
  );
};

const navWrapper = {
  top: "0px",
  left: "0px",
  position: "fixed",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  minWidth: "375px",
  zIndex: "100",
  backgroundColor: "primary",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.25)",
  transition: "background-color .3s",
  i: {
    fontSize: "2em",
  },
};

const hamburgerStyles = {
  width: "30px",
  height: "25px",
  flexDirection: "column",
  justifyContent: "space-between",
  cursor: "pointer",
  display: ["flex", "none"],
};

const hamburderPatty = {
  height: "4px",
  width: "100%",
  backgroundColor: "white",
};

export default Navbar;
