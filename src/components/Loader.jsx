import React, { useEffect, useRef } from "react";
import { Box } from "@theme-ui/components";

const Loader = () => {
  const heroBtnBackgroundRef = useRef();

  const animateHeroBtnBack = (el) => {
    const sticks = el.children;

    const expandStick = (el) => {
      el.style.height = `100%`;
      el.style.backgroundColor = `#9d8189`;
    };

    const shrinkStick = (el) => {
      el.style.height = `0%`;
      el.style.backgroundColor = `#508991`;
    };

    const animateSticks = () => {
      let stickState = false;
      setInterval(() => {
        stickState ? (stickState = false) : (stickState = true);
        if (stickState) {
          setTimeout(() => {
            expandStick(sticks[0]);
            setTimeout(() => {
              expandStick(sticks[1]);
              setTimeout(() => {
                expandStick(sticks[2]);
                setTimeout(() => {
                  expandStick(sticks[3]);
                  setTimeout(() => {
                    expandStick(sticks[4]);
                  }, 400);
                }, 300);
              }, 200);
            }, 100);
          }, 0);
        } else {
          setTimeout(() => {
            shrinkStick(sticks[0]);
            setTimeout(() => {
              shrinkStick(sticks[1]);
              setTimeout(() => {
                shrinkStick(sticks[2]);
                setTimeout(() => {
                  shrinkStick(sticks[3]);
                  setTimeout(() => {
                    shrinkStick(sticks[4]);
                  }, 400);
                }, 300);
              }, 200);
            }, 100);
          }, 0);
        }
      }, 1400);
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
        height: "200px",
        div: {
          width: "10px",
          height: "100%",
          backgroundColor: "white",
          transition: "height .5s ease, background-color .5s ease-in-out",
        },
      }}
      ref={heroBtnBackgroundRef}
    >
      <Box style={{ height: 10, backgroundColor: `#508991` }} />
      <Box style={{ height: 50, backgroundColor: `#508991` }} />
      <Box style={{ height: 80, backgroundColor: `#508991` }} />
      <Box style={{ height: 50, backgroundColor: `#508991` }} />
      <Box style={{ height: 10, backgroundColor: `#508991` }} />
    </Box>
  );
};

export default Loader;
