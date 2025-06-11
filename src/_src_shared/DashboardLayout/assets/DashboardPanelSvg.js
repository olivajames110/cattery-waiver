import { Box, useTheme } from "@mui/material";
import React from "react";

const DashboardPanelSvg = ({ color, height = "100%" }) => {
  const theme = useTheme();
  const strokeColor = color ? color : theme.palette.text.primary;
  return (
    <Box
      component={"svg"}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="-0.5 -0.5 16 16"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke={strokeColor}
      height={height}
      width={height}
    >
      <path
        d="M5.625 2.1875v10.625M1.875 5.875c0 -1.4000000000000001 0 -2.1 0.2725 -2.6350000000000002a2.5 2.5 0 0 1 1.0925 -1.0925C3.775 1.875 4.475 1.875 5.875 1.875h3.25c1.4000000000000001 0 2.1 0 2.6350000000000002 0.2725a2.5 2.5 0 0 1 1.0925 1.0925C13.125 3.775 13.125 4.475 13.125 5.875v3.25c0 1.4000000000000001 0 2.1 -0.2725 2.6350000000000002a2.5 2.5 0 0 1 -1.0925 1.0925C11.225000000000001 13.125 10.525 13.125 9.125 13.125H5.875c-1.4000000000000001 0 -2.1 0 -2.6350000000000002 -0.2725a2.5 2.5 0 0 1 -1.0925 -1.0925C1.875 11.225000000000001 1.875 10.525 1.875 9.125z"
        strokeWidth="1"
      ></path>
    </Box>
  );
};
export default DashboardPanelSvg;
