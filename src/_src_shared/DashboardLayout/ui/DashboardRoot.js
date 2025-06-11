import { Box } from "@mui/material";
import React from "react";

const DashboardRoot = ({ sx, id, children, isMobile }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          position: "relative",
          zIndex: 1,
          height: "100%",
          flexDirection: isMobile ? "column" : "row",
          overflow: "hidden",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardRoot;
