import { TextField } from "@mui/material";
import React, { useMemo } from "react";

const TextareaInput = ({
  value,
  onChange,
  fullWidth = true,
  sx,
  size = "medium",
  placeholder,
  multiline,
  InputProps,
  rows = 4,
  inputParams,
  onBlur,
  ...rest
}) => {
  const styles = useMemo(() => {
    if (multiline) {
      return {
        ...sx,
      };
    }
    return {
      ...sx,
    };
  }, [sx, multiline]);

  return (
    <TextField
      className="basic-input"
      // value={value }
      variant="outlined"
      value={value ?? ""}
      // onChange={onChange}
      onChange={(e) => onChange(e?.target?.value)}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      onBlur={onBlur}
      sx={styles}
      multiline
      rows={rows}
      inputParams={{ rows: rows, ...inputParams }}
      {...rest}
    />
  );
};
export default TextareaInput;
