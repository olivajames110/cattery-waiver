import React from "react";
import Flx from "./Flx";
import { Box, Drawer, useMediaQuery } from "@mui/material";
import ResilenderLogo from "../../assets/ResilenderLogo";

const TwoPanelLayout = ({
  children,
  sidebar,
  open,
  sidebarWidth = 320,
  sx = {},
  mobileNavMaxWidth = 768,
  mobileNavEndContent,
  sidebarSx = {},
  // isMobile,
  mainSx = {},
}) => {
  // const isMobile = useMediaQuery(`(max-width:${mobileNavMaxWidth}px)`);
  const isMobile = useMediaQuery("(max-width:888px)");
  const showMobileNavbar = isMobile && mobileNavEndContent;
  return (
    <Root column={isMobile}>
      {/* <MobileNavbar /> */}
      {showMobileNavbar ? (
        <MobileNavbar mobileNavEndContent={mobileNavEndContent} />
      ) : (
        <DesktopNavbar drawerWidth={sidebarWidth}>{sidebar}</DesktopNavbar>
      )}
      <Main>{children}</Main>
    </Root>
  );
};

const Root = ({ sx, id, children, column }) => {
  return (
    <Flx column sx={{ height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          position: "relative",
          zIndex: 1,
          height: "100%",
          flexDirection: column ? "column" : "row",
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    </Flx>
  );
};
const Main = ({ sx, id, children, isMobile }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        // backgroundColor: theme.palette.background.default,
        // color: theme.palette.text.primary,
        overflowY: "auto",
        // overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        // height: "100%",
      }}
    >
      {children}
    </Box>
  );
};

const MobileNavbar = ({ mobileNavEndContent, headerHeight = "50px" }) => {
  return (
    <>
      <Flx
        fw
        g={2}
        ac
        jb
        sx={{
          position: "relative",
          // pt: 2,
          height: headerHeight,
          background: "#ffffff",
          pl: 2,
          pr: 1,
          flexShrink: 0,
          flexGrow: 0,
          zIndex: 222,

          flexWrap: "wrap",
          boxShadow:
            "rgba(0, 0, 0, 0.32) 0px 0px 1px, rgba(0, 0, 0, 0.08) 0px 0px 2px, rgba(0, 0, 0, 0.08) 0px 1px 3px",
        }}
      >
        <ResilenderLogo width={"36px"} />
        {mobileNavEndContent}
      </Flx>
    </>
  );
};
const DesktopNavbar = ({ children, drawerWidth = 210, open = true }) => {
  // const theme = useTheme();
  // const isMobile = useMediaQuery("(max-width:768px)");
  return (
    // <Sidebar open={!isMobile} drawerWidth={collapsed ? 60 : 260}>
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      {/* <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        height: "100%",
      }}
    > */}
      {children}
      {/* </Box> */}
    </Drawer>
  );
};

// ---------------------
// OLD
// ---------------------

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
