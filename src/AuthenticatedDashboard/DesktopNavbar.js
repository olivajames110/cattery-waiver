import React from "react";

import { Drawer, useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import ResilenderLogo from "../assets/ResilenderLogo";
import Flx from "../components/layout/Flx";
import DashboardLinks from "./DashboardLinks";

const DesktopNavbar = () => {
  const open = useSelector((state) => state?.navSidebar?.open);
  // const open = true;
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <Sidebar open={!isMobile} drawerWidth={open ? 220 : 60}>
      <Flx
        fw
        column
        center
        sx={{
          position: "relative",
          pt: 2,
          pb: 2,
          zIndex: 222,
          justifyContent: "space-between",
          display: "flex",
          alignItems: "center",

          flexWrap: "wrap",
          boxShadow:
            "rgba(0, 0, 0, 0.32) 0px 0px 1px, rgba(0, 0, 0, 0.08) 0px 0px 2px, rgba(0, 0, 0, 0.08) 0px 1px 3px",
        }}
      >
        <ResilenderLogo width={!open ? "28px" : "100px"} />
      </Flx>
      <DashboardLinks collapsed={!open} />
    </Sidebar>
  );
};

const Sidebar = ({ children, drawerWidth = 210, open = true }) => {
  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            // background: "#fbfbfb",
            background: "#fafafb",
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        {children}
      </Drawer>
    </>
  );
};

export default DesktopNavbar;
