import React, { useMemo, useState } from "react";
import { Autocomplete, Box, TextField } from "@mui/material";
import { isEmpty, isNil, isString, uniqBy } from "lodash";

const SelectAutoAddableInput = ({
  value,
  onChange,
  fullWidth = true,
  sx,
  options = [],
  size = "medium",
  placeholder,
  onBlur,
  error,
  helperText,
}) => {
  const [localOptions, setLocalOptions] = useState(options);

  const selectedOption = useMemo(() => {
    return localOptions?.find((option) => (isString(option) ? option === value : option.value === value)) || null;
  }, [value, localOptions]);

  const styles = useMemo(() => {
    return {
      ".MuiAutocomplete-endAdornment": { marginRight: "0px" },
      ...sx,
    };
  }, [sx]);

  const emptyPlaceholderValue = useMemo(() => {
    return placeholder ? placeholder : "Start Typing...";
  }, [placeholder]);

  const populatedPlaceholderValue = useMemo(() => {
    return placeholder ? `Add ${placeholder}...` : "Start Typing...";
  }, [placeholder]);

  const handleChange = (event, newValue) => {
    if (!newValue) return;

    let newOption;
    if (isString(newValue)) {
      newOption = { label: newValue, value: newValue };
    } else {
      newOption = newValue;
    }

    // Ensure the new option is added to the list uniquely
    setLocalOptions((prev) => uniqBy([...prev, newOption], "value"));

    onChange(newOption.value);
  };

  return (
    <Autocomplete
      loading={isNil(localOptions) || isEmpty(localOptions)}
      value={selectedOption}
      onBlur={onBlur}
      onChange={handleChange}
      freeSolo // ✅ Allows users to type and add custom values
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      isOptionEqualToValue={(option, value) => {
        return isString(option) ? option === value : option.value === value;
      }}
      fullWidth={fullWidth}
      size={size}
      options={localOptions}
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
          placeholder={isEmpty(value) ? emptyPlaceholderValue : populatedPlaceholderValue}
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

export default SelectAutoAddableInput;
