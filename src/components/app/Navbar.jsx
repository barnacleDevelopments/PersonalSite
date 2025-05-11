/** @jsx jsx */
import { StaticImage } from "gatsby-plugin-image";
import { useState, useEffect } from "react";
import { jsx , Box, Flex, NavLink, Link } from "theme-ui";

import SideNav from "./SideNav";

const Navbar = () => {
  const [pageStatus] = useState("");
  const [navTextColorScrolled, setNavTextColorScrolled] = useState("");
  const [navScrollColor, setNavScrollColor] = useState("");
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [sideNavOpen, setSideNavOpen] = useState(false);

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

  const getTextScrolled = (path) => {
    switch (path) {
      default:
        return "#30362F";
    }
  };

  const getScrollColor = (path) => {
    switch (path) {
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
    const textColorScrolled = getTextScrolled(path);

    setNavScrollColor(scrollColor);
    setNavTextColorScrolled(textColorScrolled);

    window.addEventListener("scroll", styleNavBar);

    return function removeScrollListener() {
      window.removeEventListener("scroll", styleNavBar);
    };
  }, []);

  return (
    <Box as="nav" sx={nav}>
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
                <StaticImage alt="logo" src="../../images/logo.png" />
              </Box>
              <Box className="nav-triangle"></Box>
            </Link>
          ) : (
            <Link sx={{ width: "60px" }} href="/">
              <Box className="nav-triangle"></Box>
              <Box>
                <StaticImage alt="logo" src="../../images/logo_2.png" />
              </Box>
              <Box className="nav-triangle"></Box>
            </Link>
          )}
          <Box
            sx={hamburgerStyles}
            onClick={() => {
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
      </Flex>
      {pageStatus && isScrolledTop && (
        <Box
          sx={{
            width: "100%",
            left: 0,
            backgroundColor: "orange",
            fontWeight: "bold",
            textAlign: "center",
            p: 2,
          }}
        >
          {pageStatus}
        </Box>
      )}
    </Box>
  );
};

const nav = {
  top: "0px",
  left: "0px",
  position: "fixed",
  width: "100%",
  zIndex: "100",
};

const navWrapper = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
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
