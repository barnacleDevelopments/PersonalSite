/** @jsx jsx */
import { jsx } from "theme-ui";
import { Box, Link, Flex, NavLink } from "theme-ui";
import { StaticImage } from "gatsby-plugin-image";
import { CloseButton } from "./CloseButton";

const SideNav = ({ isOpen, setSideNavOpen, enableScrollFunc }) => {
  return (
    <Flex
      sx={{
        position: "fixed",
        height: "100vh",
        zIndex: "1000000",
        width: "100%",
        top: "0px",
        bg: "#ffffff",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        transition: "left .3s ease-in-out",
        left: isOpen ? "0px" : "-100%",
      }}
    >
      <Box sx={{ width: "90%" }}>
        <Flex
          sx={{
            width: "100%",
            justifyContent: "space-between",
            height: "60px",
            alignItems: "center",
          }}
        >
          <Link sx={{ color: "primary", width: "60px" }} href="/">
            <StaticImage alt="logo" src="../../images/logo_2.png" />
          </Link>
          <CloseButton
            onClick={() => {
              setSideNavOpen(false);
              enableScrollFunc();
            }}
          />
        </Flex>
        <Flex
          sx={{
            mt: 4,
            flexDirection: "column",
            color: "primary",
            alignItems: "center",
            a: { mb: 3 },
          }}
        >
          <NavLink variant="mobileNav" href="/">
            Home
          </NavLink>
          <NavLink variant="mobileNav" href="/posts">
            Blog
          </NavLink>
          <NavLink variant="mobileNav" href="/contact">
            Contact
          </NavLink>
          <NavLink variant="mobileNav" href="/projects">
            Projects
          </NavLink>
          <NavLink variant="mobileNav" href="/about">
            About
          </NavLink>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SideNav;
