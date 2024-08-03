import React, { useEffect, useRef } from "react";
import { Box } from "@theme-ui/components";

const Loader = () => {
  const heroBtnBackgroundRef = useRef();

  const animateHeroBtnBack = (el) => {
    const sticks = el.children;

    const expandStick = (el) => {
      el.style.height = `${Number.parseInt(el.style.height) + 20}px`;
      el.style.backgroundColor = `#9d8189`;
    };

    const shrinkStick = (el) => {
      el.style.height = `${Number.parseInt(el.style.height) - 20}px`;
      el.style.backgroundColor = `#508991`;
    };

    const animateSticks = () => {
      let stickState = false;
      setInterval(() => {
        stickState ? (stickState = false) : (stickState = true);
        if (stickState) {
          setTimeout(() => {
            expandStick(sticks[0]);
          }, 100);
          setTimeout(() => {
            expandStick(sticks[1]);
          }, 200);
          setTimeout(() => {
            expandStick(sticks[2]);
          }, 300);
          setTimeout(() => {
            expandStick(sticks[3]);
          }, 400);
          setTimeout(() => {
            expandStick(sticks[4]);
          }, 500);
        } else {
          setTimeout(() => {
            shrinkStick(sticks[0]);
          }, 100);
          setTimeout(() => {
            shrinkStick(sticks[1]);
          }, 200);
          setTimeout(() => {
            shrinkStick(sticks[2]);
          }, 300);
          setTimeout(() => {
            shrinkStick(sticks[3]);
          }, 400);
          setTimeout(() => {
            shrinkStick(sticks[4]);
          }, 500);
        }
      }, 500);
    };
    animateSticks();
  };

  useEffect(() => {
    animateHeroBtnBack(heroBtnBackgroundRef.current);
  });
  return (
    <Box
      sx={{
        width: "200px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        height: "100%",
        div: {
          width: "10px",
          height: "100%",
          backgroundColor: "white",
          transition:
            "height .5s ease-in-out, background-color .5s ease-in-out",
        },
      }}
      ref={heroBtnBackgroundRef}
    >
      <Box style={{ height: 110, backgroundColor: `#508991` }} />
      <Box style={{ height: 150, backgroundColor: `#508991` }} />
      <Box style={{ height: 180, backgroundColor: `#508991` }} />
      <Box style={{ height: 150, backgroundColor: `#508991` }} />
      <Box style={{ height: 110, backgroundColor: `#508991` }} />
    </Box>
  );
};

export default Loader;
