import { ToggleButton } from "@mui/material";
import { isFunction, isObject, isString } from "lodash";
import React from "react";
import SelectToggleButtonGroup from "./shared/SelectToggleButtonGroup";

const SelectToggleInput = ({
  value,
  onChange,
  size,
  fullWidth,
  sx,
  disabled,
  options,
  helperText,
  seperator,
  error,
  exclusive,
}) => {
  const handleOnChange = (event, val) => {
    if (disabled) {
      return;
    }
    if (!isFunction(onChange)) {
      console.error("onChange is not a function");
      return;
    }
    onChange(val);
  };

  return (
    <SelectToggleButtonGroup
      value={value}
      exclusive={exclusive}
      sx={sx}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      onChange={handleOnChange}
      helperText={helperText}
      error={error}
    >
      {options?.map((option, index) => {
        const option_label = isObject(option) ? option?.label : option;
        const option_value = isObject(option) ? option?.value : option;
        return (
          <>
            <ToggleButton
              value={option_value}
              disabled={disabled}
              key={option_label}
              aria-label={option_label}
            >
              {option_label}
            </ToggleButton>
            {seperator && index + 1 !== options?.length ? seperator : null}
          </>
        );
      })}
    </SelectToggleButtonGroup>
  );
};

export default SelectToggleInput;
