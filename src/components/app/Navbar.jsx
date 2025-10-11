/** @jsx jsx */
import { StaticImage } from "gatsby-plugin-image";
import { useState, useEffect, useRef, memo } from "react";
import { jsx, Box, Flex } from "theme-ui";
import { Link, useI18next } from "gatsby-plugin-react-i18next";

import SideNav from "./SideNav";

const Navbar = () => {
  const [isScrolledTop, setIsScrolledTop] = useState(true);
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const scrollTimeoutRef = useRef(null);

  // Get i18next context with proper fallbacks
  const i18nContext = useI18next();
  const languages = ["en", "fr"]; // Always show both languages
  const originalPath = i18nContext?.originalPath || "/";
  const language = i18nContext?.language || "en";

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

  const linkStyle = {
    mr: 3,
    color: !isScrolledTop ? "#30362F" : "white",
    textDecoration: "none",
    fontWeight: "bold",
    "&:hover": {
      textDecoration: "underline",
    },
  };

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
          <Box
            sx={{
              display: ["none", "flex"],
              alignItems: "center",
              color: "white",
              gap: 3,
            }}
          >
            <Link to="/blog" sx={linkStyle} language={language}>
              Blog
            </Link>
            <Link to="/contact" sx={linkStyle} language={language}>
              Contact
            </Link>
          </Box>
          <Link to="/" sx={{ width: "60px" }} language={language}>
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
          <Box
            sx={{
              display: ["none", "flex"],
              alignItems: "center",
              color: "white",
              gap: 3,
            }}
          >
            <Link to="/projects" sx={linkStyle} language={language}>
              Projects
            </Link>
            <Link to="/about" sx={linkStyle} language={language}>
              About
            </Link>
            <Box sx={{ display: "flex", gap: 2, ml: 2 }}>
              {languages.map((lng) => (
                <Link
                  key={lng}
                  to={originalPath}
                  language={lng}
                  sx={{
                    color: !isScrolledTop ? "#30362F" : "white",
                    textDecoration: "none",
                    fontWeight: language === lng ? "bold" : "normal",
                    fontSize: "0.9em",
                    textTransform: "uppercase",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    backgroundColor:
                      language === lng
                        ? isScrolledTop
                          ? "rgba(255,255,255,0.2)"
                          : "rgba(48,54,47,0.1)"
                        : "transparent",
                    "&:hover": {
                      backgroundColor: isScrolledTop
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(48,54,47,0.2)",
                    },
                  }}
                >
                  {lng}
                </Link>
              ))}
            </Box>
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
