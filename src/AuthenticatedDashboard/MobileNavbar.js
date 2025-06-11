import React, { useEffect, useState } from "react";

import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ResilenderLogo from "../assets/ResilenderLogo";
import Flx from "../components/layout/Flx";
import DashboardLinks from "./DashboardLinks";
import { CloseRounded, Menu, MenuRounded } from "@mui/icons-material";
import { useLocation } from "react-router-dom";

const MobileNavbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");
  const headerHeight = "50px";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

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
          zIndex: 222,

          flexWrap: "wrap",
          boxShadow:
            "rgba(0, 0, 0, 0.32) 0px 0px 1px, rgba(0, 0, 0, 0.08) 0px 0px 2px, rgba(0, 0, 0, 0.08) 0px 1px 3px",
        }}
      >
        <ResilenderLogo width={"28px"} />
        <IconButton onClick={() => setOpen((s) => !s)}>
          {open ? <CloseRounded /> : <MenuRounded />}
        </IconButton>
      </Flx>
      <NavDrawer open={open} headerHeight={headerHeight} />
    </>
  );
};

const NavDrawer = ({ headerHeight, drawerWidth = "100%", open = true }) => {
  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: 221,
          "& .MuiDrawer-paper": {
            // top: headerHeight,
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "100%",
            overflowY: "auto",
            pt: 6,
          }}
        >
          <DashboardLinks />
        </Box>
      </Drawer>
    </>
  );
};

export default MobileNavbar;
