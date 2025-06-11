import React, { useMemo, useRef } from "react";

import { Autocomplete, Box, TextField } from "@mui/material";
import { isEmpty, isNil, isString } from "lodash";

const SelectMultipleInputt = ({
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
  const selectedOption = useMemo(() => {
    return (
      options?.find((option) =>
        isString(option) ? option === value : option.value === value
      ) || null
    );
  }, [value, options]);

  const styles = useMemo(() => {
    return {
      ".MuiAutocomplete-endAdornment": { marginRight: "0px" },
      // ".MuiAutocomplete-endAdornment": { marginRight: "5px" },
      ...sx,
    };
  }, [sx]);
  return (
    <Autocomplete
      loading={isNil(options) || isEmpty(options)}
      value={selectedOption}
      onBlur={onBlur}
      onChange={(event, newValue) => {
        if (isString(newValue)) {
          onChange(newValue);
        } else {
          onChange(newValue?.value);
        }
      }}
      isOptionEqualToValue={(option, value) => {
        return isString(option) ? option === value : option.value === value;
      }}
      fullWidth={fullWidth}
      size={size}
      options={options}
      sx={styles}
      getOptionLabel={(option) => (isString(option) ? option : option.label)}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        if (isString(option)) {
          return (
            <Box key={option} {...optionProps}>
              {option}
            </Box>
          );
        }

        return (
          <Box sx={{ fontSize: ".7rem" }} key={option.value} {...optionProps}>
            {option.label}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          fullWidth={fullWidth}
          ref={params.InputProps.ref}
          placeholder={placeholder}
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

const SelectMultipleInput = ({
  value = [],
  onChange,
  fullWidth = true,
  sx,
  options,
  size = "small",
  onBlur,
  label,
  placeholder,
}) => {
  const inputRef = useRef(null); // Ref for focusing the input

  const selectedOptions = useMemo(() => {
    return options.filter((option) =>
      isString(option) ? value.includes(option) : value.includes(option.value)
    );
  }, [value, options]);

  const styles = useMemo(() => {
    return {
      ".MuiInputBase-root": {
        gap: "5px",
      },
      ".MuiAutocomplete-tag": { margin: "0" },
      ".MuiAutocomplete-endAdornment": { marginRight: "5px" },
      ".MuiChip-root": {
        marginTop: 0,
        marginBottom: 0,
        ".MuiChip-label": {
          fontSize: "11.8px",
          fontWeight: 700,
          paddingLeft: "12px",
          paddingRight: "12px",
          color: "#33475b",
        },
      },
      ...sx,
    };
  }, [sx]);

  const emptyPlacholderValue = useMemo(() => {
    if (placeholder) {
      return placeholder;
    }
    return "Start Typing...";
  }, [placeholder]);

  const populatedPlacholderValue = useMemo(() => {
    if (placeholder) {
      return `Add ${placeholder}...`;
    }
    return "Start Typing...";
  }, [placeholder]);

  return (
    <Autocomplete
      multiple
      onBlur={onBlur}
      value={selectedOptions}
      fullWidth={fullWidth}
      size={size}
      options={options}
      sx={styles}
      onChange={(event, newValue) => {
        const selectedValues = newValue.map((option) =>
          isString(option) ? option : option.value
        );
        onChange(selectedValues);

        // Set focus back to the input when a chip is deleted
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }}
      isOptionEqualToValue={(option, value) => {
        return isString(option) ? option === value : option.value === value;
      }}
      getOptionLabel={(option) => (isString(option) ? option : option.label)}
      renderOption={(props, option) => {
        const { key, ...optionProps } = props;
        if (isString(option)) {
          return (
            <Box key={option} {...optionProps}>
              {option}
            </Box>
          );
        }

        return (
          <Box sx={{ fontSize: ".7rem" }} key={option.value} {...optionProps}>
            {option.label}
          </Box>
        );
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          fullWidth={fullWidth}
          placeholder={
            isEmpty(value) ? emptyPlacholderValue : populatedPlacholderValue
          }
          inputRef={inputRef} // Attach ref to input field
          endAdornment={params.InputProps.endAdornment}
          inputProps={{
            ...params.inputProps,
          }}
        />
      )}
    />
  );
};

export default SelectMultipleInput;
