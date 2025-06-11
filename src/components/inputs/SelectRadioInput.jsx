// src/components/inputs/SelectRadioInput.jsx
import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormHelperText,
} from "@mui/material";
import isObject from "lodash/isObject";

const SelectRadioInput = ({
  name,
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  error = false,
  helperText = "",
  row = false,
  size = "small",
  sx = {},
}) => (
  <RadioGroup
    row={row}
    name={name}
    value={value ?? ""}
    onChange={(e) => onChange(e.target.value)}
  >
    {options.map((opt) => {
      const val = isObject(opt) ? opt.value : opt;
      const radioValue = typeof val === "boolean" ? String(val) : val;
      const radioLabel =
        (isObject(opt) && (opt.label || String(radioValue))) || opt;
      return (
        <FormControlLabel
          key={radioValue}
          value={radioValue}
          control={<Radio sx={{ ml: 1 }} size={size} />}
          label={radioLabel}
          sx={{
            span: {
              fontSize: "12px",
            },
          }}
        />
      );
    })}
  </RadioGroup>
  // <FormControl
  //   component="fieldset"
  //   error={error}
  //   disabled={disabled}
  //   sx={{ width: "100%", ...sx }}
  // >
  //   {label && (
  //     <FormLabel component="legend" sx={{ mb: 1 }}>
  //       {label}
  //     </FormLabel>
  //   )}
  //   <RadioGroup
  //     row={row}
  //     name={name}
  //     value={value ?? ""}
  //     onChange={(e) => onChange(e.target.value)}
  //   >
  //     {options.map((opt) => {
  //       const val = isObject(opt) ? opt.value : opt;
  //       const radioValue = typeof val === "boolean" ? String(val) : val;
  //       const radioLabel =
  //         (isObject(opt) && (opt.label || String(radioValue))) || opt;
  //       return (
  //         <FormControlLabel
  //           key={radioValue}
  //           value={radioValue}
  //           control={<Radio size={size} />}
  //           label={radioLabel}
  //         />
  //       );
  //     })}
  //   </RadioGroup>
  //   {helperText && <FormHelperText>{helperText}</FormHelperText>}
  // </FormControl>
);

export default SelectRadioInput;
