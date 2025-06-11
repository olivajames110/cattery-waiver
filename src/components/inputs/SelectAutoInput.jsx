import React, { useMemo } from "react";
import { Autocomplete, Box, TextField } from "@mui/material";
import { isEmpty, isNil, isString } from "lodash";

const SelectAutoInput = ({
  value,
  onChange,
  fullWidth = true,
  sx,
  options,
  size = "medium",
  placeholder,
  onBlur,
  error,
  helperText,
}) => {
  // Find the "selected" option object whose .value matches `value`.
  const selectedOption = useMemo(() => {
    return (
      options?.find((option) =>
        isString(option) ? option === value : option.value === value
      ) || null
    );
  }, [value, options]);

  // We replicate the "fade out" styling if no value is selected,
  // matching the style used in SelectInput.
  const styles = useMemo(() => {
    return {
      ".MuiAutocomplete-endAdornment": {
        marginRight: "0px",
      },
      // Fade out the color if there's no selected option
      "& .MuiInputBase-input": {
        color: selectedOption ? "inherit" : "rgba(0, 0, 0, 0.3)",
      },
      ...sx,
    };
  }, [sx, selectedOption]);

  const emptyPlacholderValue = useMemo(() => {
    if (placeholder) return placeholder;
    return "Start Typing...";
  }, [placeholder]);

  const populatedPlacholderValue = useMemo(() => {
    if (placeholder) return `Add ${placeholder}...`;
    return "Start Typing...";
  }, [placeholder]);

  return (
    <Autocomplete
      // If no options, show loading
      loading={isNil(options) || isEmpty(options)}
      value={selectedOption}
      onBlur={onBlur}
      onChange={(event, newValue) => {
        if (isString(newValue)) {
          onChange(newValue);
        } else {
          // If the user selects an object, take its 'value' field
          onChange(newValue?.value);
        }
      }}
      isOptionEqualToValue={(option, val) =>
        isString(option) ? option === val : option.value === val
      }
      // fullWidth={fullWidth}
      size={size}
      options={options}
      sx={styles}
      // For displaying the selected text in the input
      getOptionLabel={(option) => {
        if (isString(option)) {
          return option;
        }
        // Ensure we convert the label to a string
        return option.label !== undefined
          ? String(option.label)
          : String(option.value ?? "");
      }}
      // Display in the dropdown
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;

        if (isString(option)) {
          return (
            <Box key={option} {...optionProps}>
              {option}
            </Box>
          );
        }

        // If it's an object, prefer .optionLabel, else fallback
        const displayText =
          option.optionLabel || option.label || String(option.value ?? "");

        return (
          <Box key={option.value} sx={{ fontSize: ".7rem" }} {...optionProps}>
            {displayText}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          // fullWidth={fullWidth}
          ref={params.InputProps.ref}
          placeholder={
            isEmpty(value) ? emptyPlacholderValue : populatedPlacholderValue
          }
          {...params}
          endAdornment={params.InputProps.endAdornment}
          helperText={helperText}
          error={error}
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
    />
  );
};

export default SelectAutoInput;
