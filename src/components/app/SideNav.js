/** @jsx jsx */
import { jsx } from "theme-ui"
import { Box, Link, Flex, NavLink } from "theme-ui";
import { StaticImage } from "gatsby-plugin-image";

const SideNav = ({ isOpen, setSideNavOpen, enableScrollFunc }) => {

  return (
    <Flex sx={{
      position: "fixed",
      height: "100vh",
      zIndex: "1000000",
      width: "100%",
      top: "0px",
      bg: "white",
      justifyContent: "flex-start",
      alignItems: "center",
      flexDirection: "column",
      transition: "left .3s ease-in-out",
      left: isOpen ? '0px' : "-100%"
    }} >
      <Box sx={{ width: "90%" }}>
        <Flex sx={{
          width: "100%",
          justifyContent: "space-between",
          height: "60px",
          alignItems: "center",
        }}>
          <Link sx={{ color: "primary", width: "60px" }} href="/"><StaticImage src="../../images/logo_2.png" alt="Dev's Webshop Logo" /></Link>
          <Box onClick={() => {
            setSideNavOpen(false)
            enableScrollFunc()
          }} href="/" sx={{
            position: "relative",
            height: "30px",
            width: "30px",
            cursor: "pointer",
          }}>
            <Box sx={{
              bg: "primary",
              position: "absolute",
              height: "5px",
              width: "30px",
              transform: "rotate(45deg)",
              transformOrigin: "center",
              top: "13px",
              left: "0px",
            }}></Box>
            <Box sx={{
              bg: "primary",
              position: "absolute",
              height: "5px",
              width: "30px",
              transform: "rotate(-45deg)",
              top: "13px",
              left: "0px"
            }}></Box>
          </Box>
        </Flex>

        <Flex sx={{ mt: 4, flexDirection: "column", color: "primary", alignItems: "center", "a": { mb: 3 } }}>
          <NavLink href="/">Home</NavLink>
          <NavLink href="/posts">Blog</NavLink>
          <NavLink href="/contact">Contact</NavLink>
          <NavLink href="/projects">Projects</NavLink>
          <NavLink href="/about">About</NavLink>
        </Flex>
      </Box >
    </Flex>

  )
}

export default SideNav;