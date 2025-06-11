import {
  FormControl,
  FormHelperText,
  ToggleButtonGroup,
  useTheme,
} from "@mui/material";
import React, { useMemo } from "react";
import Flx from "../../layout/Flx";

const SelectToggleButtonGroup = ({
  value,
  defaultValue,
  fullWidth,
  onChange,
  sx,
  helperText,
  disabled,
  error,
  exclusive = true,
  children,
  size,
}) => {
  const theme = useTheme();
  const primaryTextColor = useMemo(() => "#787f8b", []);
  const activeTextColor = useMemo(() => theme.palette.primary.main, [theme]);
  // const activeTextColor = useMemo(() => "var(--titleColor)", []);
  // const primaryTextColor = useMemo(() => "var(--titleColor)", []);
  // const primaryTextColor = useMemo(() => "#2b2266", []);
  const styles = useMemo(() => {
    // console.log("s", size);
    let _minWidth = "52px";
    let _padding = "4px 12px";

    if (size === "xs") {
      _padding = "0 8px";
      _minWidth = "38px";
    }
    return {
      gap: "6px",
      flexWrap: "wrap",
      mt: 0.6,
      alignItems: "center",
      ".MuiButtonBase-root": {
        color: error ? theme.palette.error.main : primaryTextColor,
        border: "1px solid",
        borderColor: error ? theme.palette.error.main : theme.palette.divider,
        // borderColor: error ? theme.palette.error.main : "#d1d4e0",
        // borderColor: error ? theme.palette.error.main : "rgba(0, 0, 0, 0.23)",
        // backgroundColor: "#f9f9f9",
        textTransform: "initial",
        padding: _padding,
        margin: 0,

        minWidth: _minWidth,
        flexShrink: 0,
        fontWeight: 400,
        borderRadius: "12px",
        // borderRadius: "3px",
        "&.Mui-selected": {
          backgroundColor: "#f9f9f9",
          borderColor: error
            ? theme.palette.error.main
            : `${activeTextColor} !important`,
          color: error
            ? theme.palette.error.main
            : `${activeTextColor} !important`,
          fontWeight: 600,
        },
      },
      ...sx,
    };
  }, [sx, error, size, theme, primaryTextColor, activeTextColor]);

  return (
    <Flx column sx={{ flexGrow: 1 }}>
      {/* 
        Wrap everything in FormControl so MUI can handle error
        styling/ARIA attributes and pass those to FormHelperText 
      */}
      <FormControl fullWidth={fullWidth} error={error}>
        <ToggleButtonGroup
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          exclusive={exclusive}
          sx={styles}
          onChange={onChange}
        >
          {children}
        </ToggleButtonGroup>

        {/* Show helper text (in red if error=true) */}
        {helperText && <FormHelperText>{helperText}</FormHelperText>}
      </FormControl>
    </Flx>
  );
};

export default SelectToggleButtonGroup;
