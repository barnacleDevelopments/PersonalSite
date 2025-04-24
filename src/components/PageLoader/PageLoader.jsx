/** @jsx jsx */
import { jsx } from "theme-ui";
import { Flex } from "@theme-ui/components";
import Loader from "../Loader";

const PageLoader = () => (
  <Flex
    sx={{
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
      textAlign: "center",
    }}
  >
    <Loader />
  </Flex>
);

export default PageLoader;
