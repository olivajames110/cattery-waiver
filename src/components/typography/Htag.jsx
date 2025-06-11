import { Typography } from "@mui/material";
import React, { useMemo } from "react";

const Htag = ({
  children,
  sx,
  variant = "h1",
  h1,
  h2,
  h3,
  h4,
  h5,
  fontSize,
  flexShrink = 0,
  width = "fit-content",
  // width = "max-content",
}) => {
  const variantValue = useMemo(() => {
    if (h1) return "h1";
    if (h2) return "h2";
    if (h3) return "h3";
    if (h4) return "h4";
    if (h5) return "h5";
    return variant;
  }, [variant, h1, h2, h3, h4, h5]);

  const styles = useMemo(() => {
    return {
      fontSize: fontSize,
      flexShrink: flexShrink,
      width: width,
      ...sx,
    };
  }, [sx, fontSize, flexShrink, width]);
  return (
    <Typography variant={variantValue} sx={styles}>
      {children}
    </Typography>
  );
};

export default Htag;
