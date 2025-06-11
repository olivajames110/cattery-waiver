import { Box } from "@mui/material";
import React from "react";

const DashboardMain = ({ sx, id, children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,

        overflowY: "auto",

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

export default DashboardMain;
