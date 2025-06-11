import { Box, Drawer, useMediaQuery } from "@mui/material";
import React from "react";
import ResilenderLogo from "../../assets/ResilenderLogo";
import Flx from "./Flx";

const FullPageFormStepperLayout = ({
  children,
  sidebar,
  open,
  sidebarWidth = 320,
  sx = {},
  mobileNavMaxWidth = 768,
  mobileNavEndContent,
  sidebarSx = {},
  mobileHeaderHeight,
  mainSx = {},
}) => {
  const isMobile = useMediaQuery("(max-width:888px)");
  const showMobileNavbar = isMobile && mobileNavEndContent;
  return (
    <>
      {showMobileNavbar ? (
        <MobileNavbar
          mobileHeaderHeight={mobileHeaderHeight}
          mobileNavEndContent={mobileNavEndContent}
        />
      ) : (
        <DesktopNavbar drawerWidth={sidebarWidth}>{sidebar}</DesktopNavbar>
      )}
      <Main>{children}</Main>
    </>
  );
};

const Main = ({ sx, id, children, isMobile }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,

        overflowY: "auto",
        pt: 5,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {children}
    </Box>
  );
};

const MobileNavbar = ({ mobileNavEndContent, mobileHeaderHeight = "50px" }) => {
  return (
    <>
      <Flx
        fw
        g={2}
        ac
        jb
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          height: mobileHeaderHeight,
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
  return (
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
      {children}
    </Drawer>
  );
};

export default FullPageFormStepperLayout;
