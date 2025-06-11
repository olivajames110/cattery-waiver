import { Drawer } from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";

const DashboardSidebarPane = ({ children, drawerWidth = 210, open = true }) => {
  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,

            // background: grey[900],
            // background: "#fafafb",
            background: (theme) => theme.palette.background.default,
            // background: "#323232", //grey[800],
            boxSizing: "border-box",
          },
          ".MuiDivider-root": {
            borderColor: grey[800],
            // borderColor: grey[800],
          },
          //   ".link-list-group": {
          //     ".link-list-group-title": {
          //       color: `${grey[500]} !important`,
          //     },
          //     "a, .link-list-item-button": {
          //       color: `#ffffff !important`,
          //     },
          //   },
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

export default DashboardSidebarPane;
