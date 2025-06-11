import { Box } from "@mui/material";
import React from "react";

const TitledGroupContent = ({ children, sx, suppressPadding }) => {
  return <Box sx={{ p: suppressPadding ? 0 : 1.5, ...sx }}>{children}</Box>;
};
export default TitledGroupContent;
