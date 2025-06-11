import { TextField } from "@mui/material";
import { isFunction } from "lodash";
import React, { useMemo } from "react";

const TextInput = ({
  value,
  onChange,
  fullWidth = true,
  sx,
  size = "medium",
  placeholder,
  multiline,
  InputProps,
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
      variant="outlined"
      value={value ?? ""}
      onChange={(e) => {
        if (isFunction(onChange)) {
          onChange(e.target.value);
        }
      }}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      onBlur={onBlur}
      sx={styles}
      multiline={multiline}
      InputProps={InputProps}
      {...inputParams}
      {...rest}
    />
  );
};
export default TextInput;
