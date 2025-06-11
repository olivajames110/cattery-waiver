import { MenuItem, TextField } from "@mui/material";
import { isBoolean, isFunction, isObject } from "lodash";
import React, { useMemo } from "react";

const SelectInput = ({
  value,
  onChange,
  sx,
  error,
  disabled,
  options = [],
  size = "small",
  fullWidth = true,
  placeholder = "Select from the following",
  helperText,
}) => {
  // Convert incoming value to string for <MenuItem value="...">
  const select_value = useMemo(() => {
    if (isBoolean(value)) {
      return value ? "true" : "false";
    }
    const validOptionValues = options.map((opt) =>
      isObject(opt) ? opt.value : opt
    );
    return validOptionValues.includes(value) ? value : "";
  }, [value, options]);

  const handleChange = (e) => {
    if (!isFunction(onChange)) {
      console.error("onChange is not a function");
      return;
    }
    const raw = e.target.value;
    // parse booleans
    const parsed = raw === "true" ? true : raw === "false" ? false : raw;
    // find full option object
    const selectedOption = options.find((opt) => {
      const optVal = isObject(opt) ? opt.value : opt;
      return optVal === parsed;
    });
    // call with both
    onChange(parsed, selectedOption);
  };

  return (
    <TextField
      select
      size={size}
      error={error}
      disabled={disabled}
      helperText={helperText}
      fullWidth={fullWidth}
      value={select_value || ""}
      onChange={handleChange}
      displayEmpty
      SelectProps={{
        displayEmpty: true,
        renderValue: (selectedValue) => {
          if (!selectedValue) {
            return (
              <span style={{ color: "rgba(0, 0, 0, 0.3)" }}>{placeholder}</span>
            );
          }
          const found = options.find((opt) => {
            const optVal = isObject(opt)
              ? isBoolean(opt.value)
                ? opt.value
                  ? "true"
                  : "false"
                : opt.value
              : opt;
            return optVal === selectedValue;
          });
          return (found && isObject(found) && found.label) || selectedValue;
        },
      }}
      inputProps={{ "aria-label": placeholder }}
      sx={{
        "& .MuiSelect-root": {
          color: select_value ? "inherit" : "rgba(0, 0, 0, 0.3)",
        },
        ...sx,
      }}
    >
      <MenuItem
        value=""
        disabled
        sx={{
          fontStyle: "italic",
          opacity: 0.4,
          color: "rgba(0, 0, 0, 0.4) !important",
        }}
      >
        {placeholder}
      </MenuItem>

      {options.map((option) => {
        const val = isObject(option) ? option.value : option;
        const option_value = isBoolean(val) ? (val ? "true" : "false") : val;
        const menuItemLabel = isObject(option)
          ? option.optionLabel || option.label || String(option_value)
          : option;

        return (
          <MenuItem key={option_value} value={option_value}>
            {menuItemLabel}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default SelectInput;
