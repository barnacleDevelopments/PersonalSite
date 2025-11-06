/** @jsx jsx */
import { StaticImage } from "gatsby-plugin-image";
import { useState, useEffect, useRef, memo } from "react";
import { jsx, Box, Flex } from "theme-ui";
import { Link } from "gatsby";

import SideNav from "./SideNav";

const Navbar = () => {
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const scrollTimeoutRef = useRef(null);

  const styleNavBar = () => {
    if (scrollTimeoutRef.current) {
      return;
    }

    scrollTimeoutRef.current = setTimeout(() => {
      if (window.scrollY < 20) {
        setIsScrolledTop(true);
      } else {
        setIsScrolledTop(false);
      }
      scrollTimeoutRef.current = null;
    }, 16);
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
    window.addEventListener("scroll", styleNavBar, { passive: true });

    return function removeScrollListener() {
      window.removeEventListener("scroll", styleNavBar);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box as="nav" sx={nav}>
      <Flex
        sx={navWrapper}
        style={{ backgroundColor: !isScrolledTop ? "#ffffff" : null }}
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
            <Link
              to="/blog"
              sx={{
                mr: 3,
                color: !isScrolledTop ? "#30362F" : "white",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Blog
            </Link>
            <Link
              to="/contact"
              sx={{
                color: !isScrolledTop ? "#30362F" : "white",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Contact
            </Link>
          </Box>
          <Link to="/" sx={{ width: "60px" }}>
            <Box className="nav-triangle"></Box>
            <Box sx={{ filter: isScrolledTop ? "none" : "brightness(0)" }}>
              <StaticImage alt="logo" src="../../images/logo.png" />
            </Box>
            <Box className="nav-triangle"></Box>
          </Link>
          <Box
            sx={hamburgerStyles}
            onClick={() => {
              setSideNavOpen(true);
              disableScroll();
            }}
          >
            <div
              sx={{
                ...hamburderPatty,
                backgroundColor: isScrolledTop ? "#ffffff" : "#30362F",
              }}
            ></div>
            <div
              sx={{
                ...hamburderPatty,
                backgroundColor: isScrolledTop ? "#ffffff" : "#30362F",
              }}
            ></div>
            <div
              sx={{
                ...hamburderPatty,
                backgroundColor: isScrolledTop ? "#ffffff" : "#30362F",
              }}
            ></div>
          </Box>
          <Box sx={{ display: ["none", "block"], color: "white" }}>
            <Link
              to="/projects"
              sx={{
                mr: 3,
                color: !isScrolledTop ? "#30362F" : "white",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Projects
            </Link>
            <Link
              to="/about"
              sx={{
                color: !isScrolledTop ? "#30362F" : "white",
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              About
            </Link>
          </Box>
        </Box>
      </Flex>
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

export default memo(Navbar);
