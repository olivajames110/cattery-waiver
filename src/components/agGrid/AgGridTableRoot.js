import { Box } from "@mui/material";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import "ag-grid-enterprise";
// import "./ag-grid-quartz-theme.css";
// import "./AgGridTableRoot.css"; // <-- Import the new CSS file here

import { AllCommunityModule, ModuleRegistry } from "ag-grid-enterprise";
import { blue } from "@mui/material/colors";

// Register the modules you need
ModuleRegistry.registerModules([AllCommunityModule]);

const AgGridTableRoot = ({
  children,
  sx,
  height = "auto",
  size = 6,
  activeRowBackgroundColor = blue[50],

  fullHeight,

  // New props for border control
  noBorder,
  showLeftBorder,
  showRightBorder,
  showTopBorder,
  showBottomBorder,
  noBorderRadius,
}) => {
  const dynamicClassName = useMemo(() => {
    const classes = [];

    // Example usage from your existing code

    classes.push(`size-${size}`);

    // Add classes based on border props
    if (noBorder) classes.push("no-border");
    if (showLeftBorder) classes.push("left-border");
    if (showRightBorder) classes.push("right-border");
    if (showTopBorder) classes.push("top-border");
    if (showBottomBorder) classes.push("bottom-border");
    if (noBorderRadius) classes.push("no-border-radius");

    return classes.join(" ");
  }, [
    size,
    noBorder,
    showLeftBorder,
    showRightBorder,
    showTopBorder,
    showBottomBorder,
    noBorderRadius,
  ]);

  return (
    <Box
      className={`ag-theme-quartz ${dynamicClassName} custom-ag-table-wrapper`}
      sx={{
        width: "100%",
        height: fullHeight ? "100%" : height,
        ".active": {
          background: activeRowBackgroundColor,
        },
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};

AgGridTableRoot.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
  height: PropTypes.string,
  size: PropTypes.number,
  exampleProp: PropTypes.bool,
  fullHeight: PropTypes.bool,

  // New border/border-radius props
  noBorder: PropTypes.bool,
  showLeftBorder: PropTypes.bool,
  showRightBorder: PropTypes.bool,
  showTopBorder: PropTypes.bool,
  showBottomBorder: PropTypes.bool,
  noBorderRadius: PropTypes.bool,
};

export default AgGridTableRoot;
