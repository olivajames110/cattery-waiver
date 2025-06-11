import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

const Txt = ({
  children,
  sx = {},
  variant = "body1",
  body2,
  subtitle1,
  subtitle2,
  secondary = false,
  className = "",
  bold = false,
  fw,
  center = false,
  component = "span",
  color,
  fontSize,
  ...otherProps
}) => {
  // determine MUI variant
  let variantValue = variant;
  if (body2) variantValue = "body2";
  else if (subtitle1) variantValue = "subtitle1";
  else if (subtitle2) variantValue = "subtitle2";

  // font weight fallback
  const fontWeight = bold ? 700 : fw;

  // build the sx object
  const mergedSx = {
    // secondary overrides
    ...(secondary && {
      fontWeight: 400,
      fontSize: "0.75rem",
      lineHeight: 1.43,
      color: "rgba(0, 0, 0, 0.6)",
    }),
    // center text
    ...(center && { textAlign: "center" }),
    // allow user overrides last
    ...sx,
  };

  return (
    <Typography
      component={component}
      variant={variantValue}
      color={color}
      className={`txt ${secondary ? "secondary" : ""} ${className}`.trim()}
      sx={mergedSx}
      fontWeight={fontWeight}
      fontSize={fontSize}
      {...otherProps}
    >
      {children}
    </Typography>
  );
};

Txt.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
  component: PropTypes.elementType,
  variant: PropTypes.oneOf([
    "body1",
    "body2",
    "subtitle1",
    "subtitle2",
    "inherit",
  ]),
  body2: PropTypes.bool,
  subtitle1: PropTypes.bool,
  subtitle2: PropTypes.bool,
  secondary: PropTypes.bool,
  className: PropTypes.string,
  bold: PropTypes.bool,
  fw: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  center: PropTypes.bool,
  color: PropTypes.string,
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Txt;
