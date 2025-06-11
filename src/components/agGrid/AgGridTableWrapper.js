import { Box } from "@mui/material";
import PropTypes from "prop-types";
import React, { useMemo } from "react";
import "ag-grid-enterprise";

import "../../styles/AgGridTableWrapper.css";
import "ag-grid-community/styles/ag-theme-balham.css";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-enterprise";
import { blue } from "@mui/material/colors";
import { isArray } from "lodash";

// Register the modules you need
ModuleRegistry.registerModules([AllCommunityModule]);

const AgGridTableWrapper = ({
  children,
  sx,
  height = "auto",
  size = 6,
  activeRowBackgroundColor = blue[50],
  suppressMinHeightWhenPopulated,
  fullHeight,

  // Border control props
  noBorder,
  noBorderY,
  noBorderX,
  showLeftBorder,
  showRightBorder,
  showTopBorder,
  showBottomBorder,
  noBorderRadius,
  borderRadius,

  // Simple table styling prop
  simpleTable,
}) => {
  const dynamicClassName = useMemo(() => {
    const classes = [];

    // Add size class
    classes.push(`size-${size}`);

    // Add border control classes
    if (noBorder) classes.push("no-border");
    if (noBorderY) classes.push("no-border-y");
    if (noBorderX) classes.push("no-border-x");
    if (showLeftBorder) classes.push("show-left-border");
    if (showRightBorder) classes.push("show-right-border");
    if (showTopBorder) classes.push("show-top-border");
    if (showBottomBorder) classes.push("show-bottom-border");
    if (noBorderRadius) classes.push("no-border-radius");

    // Handle border radius variants
    if (borderRadius) {
      classes.push(`border-radius-${borderRadius}`);
    }

    // Add simple table class if prop is true
    if (simpleTable) classes.push("simple-table");

    // Handle suppress min height
    if (isArray(suppressMinHeightWhenPopulated)) {
      if (suppressMinHeightWhenPopulated?.length >= 1) {
        classes.push("suppress-min-height");
      }
    }

    return classes.join(" ");
  }, [
    size,
    noBorder,
    noBorderY,
    noBorderX,
    showLeftBorder,
    showRightBorder,
    showTopBorder,
    showBottomBorder,
    noBorderRadius,
    borderRadius,
    suppressMinHeightWhenPopulated,
    simpleTable,
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

AgGridTableWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  sx: PropTypes.object,
  height: PropTypes.string,
  size: PropTypes.number,
  fullHeight: PropTypes.bool,
  activeRowBackgroundColor: PropTypes.string,
  suppressMinHeightWhenPopulated: PropTypes.array,

  // Border control props
  noBorder: PropTypes.bool,
  noBorderY: PropTypes.bool,
  noBorderX: PropTypes.bool,
  showLeftBorder: PropTypes.bool,
  showRightBorder: PropTypes.bool,
  showTopBorder: PropTypes.bool,
  showBottomBorder: PropTypes.bool,
  noBorderRadius: PropTypes.bool,
  borderRadius: PropTypes.oneOf(["small", "medium", "large", "xl"]),

  // Simple table styling prop
  simpleTable: PropTypes.bool,
};

export default AgGridTableWrapper;
