import { Link } from "gatsby";
/** @jsx jsx */
import { forwardRef } from "react";
import { Box, Flex, Heading } from "theme-ui";
import { CloseButton } from "../app/CloseButton";

const ProjectDialog = forwardRef(({ title, projects }, ref) => {
  return (
    <dialog style={{ position: "fixed", zIndex: 10000, padding: 0 }} ref={ref}>
      {title && projects && (
        <Box
          sx={{
            borderColor: "white",
            borderRadius: 4,
            backgroundColor: "white",
            p: 4,
          }}
        >
          <Box>
            <Flex
              sx={{
                alignItems: "center",
                justifyContent: "space-between",
                gap: 3,
                mb: 3,
              }}
            >
              <Heading sx={{ mb: 0 }} variant="subheading2">
                {title} - Projects
              </Heading>
              <CloseButton
                sx={{ position: "absolute" }}
                onClick={() => {
                  ref.current.close();
                }}
              />
            </Flex>
            <ul>
              {projects.map((project) => {
                return (
                  <li key={project.title} sx={{ mb: 2 }}>
                    <Link
                      to={project.slug}
                      sx={{
                        color: "orange",
                        textDecoration: "none",
                        "&:hover": {
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {project.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Box>
        </Box>
      )}
    </dialog>
  );
});

export default ProjectDialog;
