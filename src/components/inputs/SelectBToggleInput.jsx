import { ToggleButton } from "@mui/material";
import { isFunction, isString } from "lodash";
import React from "react";
import SelectToggleButtonGroup from "../shared/SelectToggleButtonGroup.jsx";

const SelectToggleInput = ({ value, onChange, fullWidth, sx, options }) => {
  const handleOnChange = (event, val) => {
    if (!isFunction(onChange)) {
      console.error("onChange is not a function");
      return;
    }
    onChange(val);
  };

  return (
    <SelectToggleButtonGroup
      value={value}
      exclusive
      sx={sx}
      fullWidth={fullWidth}
      onChange={handleOnChange}
    >
      {options?.map((option) => {
        const option_label = isString(option) ? option : option?.label;
        const option_value = isString(option) ? option : option?.value;
        return (
          <ToggleButton
            value={option_value}
            key={option_label}
            aria-label={option_label}
          >
            {option_label}
          </ToggleButton>
        );
      })}
    </SelectToggleButtonGroup>
  );
};

export default SelectToggleInput;
