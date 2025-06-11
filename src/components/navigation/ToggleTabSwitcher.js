import React, { useMemo } from "react";

import { ToggleButton, useTheme } from "@mui/material";
import { indexOf, isNil, merge } from "lodash";

import styled from "@emotion/styled";
import { ToggleButtonGroup } from "@mui/material";

const ToggleTabSwitcher = ({
  value,
  tabs,
  onChange,
  sx,
  variant, //background || underline
  useIndex,
  orientation = "horizontal",
  underlinePosition = "bottom", // new prop: "bottom", "top", "left", "right"
}) => {
  const handleOnTabSwitch = (event, newValue) => {
    if (isNil(newValue)) {
      return;
    }

    if (useIndex) {
      console.log(newValue);
      onChange(newValue);
      return;
    }
    // console.log(tabs[newValue]);

    onChange(tabs[newValue]);
  };

  const _value = useMemo(() => {
    if (useIndex) {
      return value;
    }
    return indexOf(tabs, value);
  }, [useIndex, tabs, value]);
  return (
    <TabSwitcherGroup
      orientation={orientation}
      variant={variant}
      underlinePosition={underlinePosition}
      value={_value}
      exclusive
      sx={sx}
      onChange={handleOnTabSwitch}
      aria-label="text alignment"
    >
      {tabs.map((tab, ind) => {
        return (
          // <ToggleButton key={tab} value={tab}>
          <ToggleButton key={tab} value={ind}>
            {tab}
          </ToggleButton>
        );
      })}
    </TabSwitcherGroup>
  );
};

const TabSwitcherGroup = ({
  value,
  children,
  full,
  onChange,
  orientation = "horizontal",
  ariaLabel,
  variant = "background",
  underlinePosition = "bottom", // new prop
  sx,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => {
    const baseStyles = {
      flexGrow: full ? 1 : 0,
      ".MuiButtonBase-root": {
        flexGrow: full ? 1 : 0,
        // Put the most common shared styles here:
        color: "#181d1f",
        // margin: "0 !important",
        // ml: 0,
        // ml: "0 !important",
        // mr: "0 !important",
        fontWeight: 400,
        fontSize: "13px",
        // Prevent text wrapping in vertical orientation
        ...(orientation === "vertical" && {
          whiteSpace: "nowrap",
          minWidth: "fit-content",
          justifyContent: "flex-start",
          borderLeft: "2px solid transparent",
        }),

        "&.Mui-selected": {
          color: "#2962ff",
          fontWeight: 700,

          // Override default background for variants
          ...(variant === "underline"
            ? {
                background: "none",
                borderRadius: "0 !important",
                fontWeight: 500,
              }
            : {
                background: "#2962ff14",
              }),

          // Handle border placement based on orientation and position
          ...(variant === "underline" && {
            borderTop: "none",
            borderRight: "none",
            borderBottom: "none",
            borderLeft: "none",
            ...(orientation === "horizontal" &&
              underlinePosition === "bottom" && {
                borderBottom: "2px solid #2962ff",
              }),
            ...(orientation === "horizontal" &&
              underlinePosition === "top" && {
                borderTop: "2px solid #2962ff",
              }),
            ...(orientation === "vertical" &&
              underlinePosition === "left" && {
                borderLeft: "2px solid #2962ff",
              }),
            ...(orientation === "vertical" &&
              underlinePosition === "right" && {
                borderRight: "2px solid #2962ff",
              }),
          }),
        },
      },

      "& .MuiToggleButtonGroup-grouped": {
        margin: theme?.spacing(0.5),
        border: 0,
        borderLeft: "2px solid transparent",
        textTransform: "capitalize",
        "&.Mui-disabled": {
          border: 0,
        },
        "&:not(:first-of-type)": {
          borderRadius: "4px",
        },
        "&:first-of-type": {
          borderRadius: "4px",
        },
      },
    };

    // ------------
    // VARIANTS:
    // ------------
    const variants = {
      underline: {
        ".MuiButtonBase-root": {
          fontSize: "12px",
          // Base styles for underline variant are now handled in the main Mui-selected section above
        },
      },
    };

    const variantStyles = variants[variant] ?? {};

    const mergedStyles = merge(merge({}, baseStyles), variantStyles);
    const finalStyles = merge(mergedStyles, sx);
    return finalStyles;
  }, [sx, variant, full, theme, orientation, underlinePosition]); // Ensure all dependencies are tracked

  return (
    <ToggleButtonGroup
      size="small"
      orientation={orientation}
      value={value}
      exclusive
      onChange={onChange}
      aria-label={ariaLabel}
      sx={styles}
      // sx={{ pl: 1, ...sx }}
    >
      {children}
    </ToggleButtonGroup>
  );
};

export default ToggleTabSwitcher;
