import { Link } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { Box, Flex } from "theme-ui";
import { CloseButton } from "./CloseButton";

const SideNav = ({ isOpen, setSideNavOpen, enableScrollFunc }) => {
  const handleLinkClick = () => {
    setSideNavOpen(false);
    enableScrollFunc();
  };

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
          <Link
            to="/"
            sx={{ color: "primary", width: "60px" }}
            onClick={handleLinkClick}
          >
            <StaticImage alt="logo" src="../../images/logo_2.png" />
          </Link>
          <CloseButton
            sx={{
              position: "absolute",
              cursor: "pointer",
            }}
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
          <Link
            to="/"
            sx={{
              color: "primary",
              textDecoration: "none",
              fontSize: 4,
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleLinkClick}
          >
            Home
          </Link>
          <Link
            to="/blog"
            sx={{
              color: "primary",
              textDecoration: "none",
              fontSize: 4,
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleLinkClick}
          >
            Blog
          </Link>
          <Link
            to="/contact"
            sx={{
              color: "primary",
              textDecoration: "none",
              fontSize: 4,
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleLinkClick}
          >
            Contact
          </Link>
          <Link
            to="/projects"
            sx={{
              color: "primary",
              textDecoration: "none",
              fontSize: 4,
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleLinkClick}
          >
            Projects
          </Link>
          <Link
            to="/about"
            sx={{
              color: "primary",
              textDecoration: "none",
              fontSize: 4,
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
            onClick={handleLinkClick}
          >
            About
          </Link>
        </Flex>
      </Box>
    </Flex>
  );
};

export default SideNav;
