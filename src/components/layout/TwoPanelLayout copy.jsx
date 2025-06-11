import React from "react";
import Flx from "./Flx";
import { Box, Drawer } from "@mui/material";

const TwoPanelLayout = ({
  children,
  sidebar,
  open,
  sidebarWidth = 320,
  sx = {},
  sidebarSx = {},
  mainSx = {},
}) => {
  return (
    <TwoPanelLayoutRoot sx={sx}>
      <TwoPanelLayoutSidebar
        open={open}
        sidebarSx={sidebarSx}
        sidebarWidth={sidebarWidth}
      >
        {sidebar}
      </TwoPanelLayoutSidebar>
      <TwoPanelLayoutMain mainSx={mainSx}>{children}</TwoPanelLayoutMain>
    </TwoPanelLayoutRoot>
  );
};

const TwoPanelLayoutRoot = ({ sx, id, children, component }) => {
  return (
    <Flx column sx={{ height: "100vh", ...sx }}>
      <Box
        sx={{
          display: "flex",
          position: "relative",
          zIndex: 1,
          height: "100%",

          // flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    </Flx>
  );
};

const TwoPanelLayoutSidebar = ({
  children,
  sidebarWidth,
  open = true,
  sidebarSx,
}) => {
  return (
    <>
      <Drawer
        variant="permanent"
        // open={!open}
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
          position: "relative",
          [`& .MuiDrawer-paper`]: {
            position: "absolute",
            width: sidebarWidth,
            background: "#ffffff",
            boxSizing: "border-box",
            // overflow: "hidden",
            // borderColor: "#dde0e4",
            border: "none",
          },
          ...sidebarSx,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "100%",
          }}
        >
          {children}
        </Box>
      </Drawer>
    </>
  );
};

const TwoPanelLayoutMain = ({ mainSx, id, children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        // backgroundColor: theme.palette.background.default,
        // color: theme.palette.text.primary,
        // background: "#fafafb",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        ...mainSx,
      }}
    >
      {children}
    </Box>
  );
};
export default TwoPanelLayout;
