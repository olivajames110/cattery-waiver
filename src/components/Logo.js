import { Box } from "@mui/material";
import React from "react";

const Logo = ({ height = 50, sx }) => {
  return (
    <Box
      component="img"
      src="https://oneclickrescue.blob.core.windows.net/5009/images/items/image5088.png"
      sx={{ height: height, ...sx }}
    />
  );
};

export default Logo;
