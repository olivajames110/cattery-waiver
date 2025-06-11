import React, { useMemo } from "react";
import Flx from "../../layout/Flx";
import { Box, FormHelperText, InputLabel } from "@mui/material";
import { isBoolean, isNumber } from "lodash";

const InputWrapper = ({
  sx,
  fullWidth,
  children,
  helperText,
  bold,
  label,
  labelSx,
  fw,
  required,
  mb,
  mt,
}) => {
  const styles = useMemo(() => {
    return {
      ...sx,
      mb: isBoolean(mb) ? 2 : isNumber(mb) ? mb : 0,
      mt: isBoolean(mt) ? 2 : isNumber(mt) ? mt : 0,
    };
  }, [sx, mt, mb]);
  return (
    <Flx fw={fullWidth} column className={"input-wrapper-root"} sx={styles}>
      <InputLabel
        sx={{
          whiteSpace: "normal",
          fontWeight: bold ? "bold" : fw ? fw : "normal",
          marginBottom: "3px",
          ...labelSx,
        }}
      >
        {label}
        {required ? (
          <Box sx={{ pl: 0.5, display: "inline-block" }}>
            <span style={{ color: "var(--titleColor)" }}>*</span>
          </Box>
        ) : null}
      </InputLabel>
      {children}
      {helperText ? (
        <FormHelperText
          sx={{ fontStyle: "italic", fontSize: "12px !important" }}
        >
          {helperText}
        </FormHelperText>
      ) : null}
    </Flx>
  );
};

export default InputWrapper;
