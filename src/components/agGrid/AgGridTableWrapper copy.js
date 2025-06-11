// import { Box } from "@mui/material";
// import React, { useMemo } from "react";

// import "ag-grid-community/styles/ag-grid.css";
// import "ag-grid-community/styles/ag-theme-quartz.css";
// import "ag-grid-enterprise";
// import "../../src/assets/styles/ag-grid-quartz-theme.css";
// import PropTypes from "prop-types";

// const AgGridTableWrapper = ({
//   children,
//   sx,
//   height = "auto",
//   size = 6,
//   suppressBorder,
//   suppressHorizontalBorder,
//   suppressVerticalBorder,
//   suppressBorderRadius,
//   suppressBorderRadiusBottom,
//   suppressBorderRadiusTop,
//   suppressMinHeight,
//   suppressLastRowBorder,
//   showOnlyTopBorder,
//   fullHeight,
// }) => {
//   const dynamicClassName = useMemo(() => {
//     const classes = [];

//     if (suppressBorderRadius) classes.push("suppress-border-radius");
//     if (suppressBorderRadiusBottom) classes.push("suppress-border-radius-bottom");
//     if (suppressBorderRadiusTop) classes.push("suppress-border-radius-top");
//     if (suppressMinHeight) classes.push("suppress-min-height");
//     if (suppressBorder) classes.push("suppress-border");
//     if (suppressHorizontalBorder) classes.push("suppress-horizontal-border");
//     if (suppressVerticalBorder) classes.push("suppress-vertical-border");
//     if (showOnlyTopBorder) classes.push("show-only-top-border");
//     if (suppressLastRowBorder) classes.push("suppress-last-row-border");
//     if (fullHeight) classes.push("full-height");
//     classes.push(`size-${size}`);

//     return classes.join(" ");
//   }, [
//     suppressBorderRadius,
//     suppressBorderRadiusBottom,
//     suppressBorderRadiusTop,
//     fullHeight,
//     suppressMinHeight,
//     suppressBorder,
//     suppressVerticalBorder,
//     suppressHorizontalBorder,
//     showOnlyTopBorder,
//     suppressLastRowBorder,
//     size,
//   ]);

//   return (
//     <Box
//       className={`ag-theme-quartz ${dynamicClassName} custom-ag-table-wrapper `}
//       sx={{ width: "100%", height: fullHeight ? "100%" : height, ...sx }}
//     >
//       {children}
//     </Box>
//   );
// };

// AgGridTableWrapper.propTypes = {
//   children: PropTypes.node.isRequired,
//   sx: PropTypes.object,
//   height: PropTypes.string,
//   size: PropTypes.number,
//   suppressBorder: PropTypes.bool,
//   suppressHorizontalBorder: PropTypes.bool,
//   suppressVerticalBorder: PropTypes.bool,
//   suppressBorderRadius: PropTypes.bool,
//   suppressBorderRadiusBottom: PropTypes.bool,
//   suppressBorderRadiusTop: PropTypes.bool,
//   suppressMinHeight: PropTypes.bool,
//   showOnlyTopBorder: PropTypes.bool,
//   suppressLastRowBorder: PropTypes.bool,
//   fullHeight: PropTypes.bool,
// };
// export default AgGridTableWrapper;
