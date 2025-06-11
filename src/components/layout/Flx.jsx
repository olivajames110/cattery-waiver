import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { isBoolean, isNil, isString } from "lodash";

const Flx = ({
  children,
  sx,
  center,
  end,
  column = false,
  wrap = false,
  ac,
  id,
  jc,
  g,
  gap,
  ai,
  p,
  className,
  flexGrow = 0,
  flexShrink = 1,
  flexBasis = "auto",
  width = "auto",
  fw,
  jb,
}) => {
  /**
   * A flexible container component that renders a `Box` with configurable flex properties.
   *
   * @param {object} props - The component props.
   * @param {React.ReactNode} props.children - Child elements to be rendered inside the container.
   * @param {object} [props.sx] - Additional style overrides for the container.
   * @param {boolean} [props.center] - If `true`, the container will center its content both horizontally and vertically.
   * @param {boolean} [props.end] - If `true`, content will be aligned to the end (flex-end).
   * @param {boolean} [props.column=false] - If `true`, flex direction is set to "column"; otherwise "row".
   * @param {boolean} [props.p] -  If `true`, padding will be applied to the container.
   * @param {boolean} [props.wrap=false] - If `true`, flex items will wrap onto multiple lines.
   * @param {boolean|string} [props.jc] - Custom `justify-content`; if boolean, treated as `center`; if string, that string value is used directly.
   * @param {boolean} [props.ac] - If `true`, align-items will be set to "center".
   * @param {string} [props.ai] - Manually specify `align-items` (overrides `ac`).
   * @param {number} [props.g] - Gap size in **px** (numeric).
   * @param {number} [props.gap] - Alternative gap size prop (numeric).
   * @param {number} [props.flexGrow=0] - The flex-grow property (default is 0).
   * @param {number} [props.flexShrink=1] - The flex-shrink property (default is 1).
   * @param {string|number} [props.flexBasis="auto"] - The flex-basis property (can be a string like "auto" or a number).
   * @param {string|number} [props.width="auto"] - The width of the container (can be a string or number).
   * @param {boolean} [props.fw] - If `true`, forces the container to have `width: 100%`.
   * @param {boolean} [props.jb] - If `true`, sets `justify-content` to "space-between".
   * @param {string} [props.className] - Additional className to apply to the Box.
   * @returns {JSX.Element} A styled `<Box>` component with the specified flex properties.
   */

  // Create a dynamic style object
  const styles = useMemo(() => {
    const dynamicStyles = {
      flexDirection: column ? "column" : "row",
      justifyContent: jb
        ? "space-between"
        : center || isBoolean(jc)
          ? "center"
          : isString(jc)
            ? jc
            : end
              ? "flex-end"
              : "flex-start",
      alignItems: center || ac ? "center" : isString(ai) ? ai : "stretch",
      gap: gap || g,
      flexGrow,
      flexShrink,
      flexBasis,
      width: fw ? "100%" : width,
    };

    return {
      display: "flex",
      flexWrap: wrap ? "wrap" : "nowrap",
      height: "auto",
      boxSizing: "border-box",
      ...dynamicStyles,
      ...sx,
    };
  }, [
    end,
    column,
    ac,
    jc,
    g,
    gap,
    wrap,
    center,
    sx,
    ai,
    flexGrow,
    flexShrink,
    flexBasis,
    width,
    fw,
    jb,
  ]);

  return (
    <Box id={id} p={p} className={className} sx={styles}>
      {children}
    </Box>
  );
};

Flx.propTypes = {
  sx: PropTypes.object,
  children: PropTypes.node.isRequired,
  center: PropTypes.bool,
  end: PropTypes.bool,
  column: PropTypes.bool,
  jc: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  wrap: PropTypes.bool,
  g: PropTypes.number,
  gap: PropTypes.number,
  flexGrow: PropTypes.number, // Added flex-grow prop
  flexShrink: PropTypes.number, // Added flex-shrink prop
  flexBasis: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Added flex-basis prop
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Added width prop
  className: PropTypes.string,
  ai: PropTypes.string,
  id: PropTypes.string,
  fw: PropTypes.bool,
  jb: PropTypes.bool,
};

export default Flx;
