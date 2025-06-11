import { TextField } from "@mui/material";
import isFinite from "lodash/isFinite";
import isNil from "lodash/isNil";
import isNumber from "lodash/isNumber";
import { useMemo } from "react";

/**
 * NumberInput component that handles number inputs including floats and decimals
 * @param {number|null} value - The current value
 * @param {function} onChange - Callback when value changes
 * @param {boolean} [fullWidth=true] - Whether the input takes full width
 * @param {object} [sx] - Custom styles
 * @param {string} [size="medium"] - Size of the input
 * @param {string} [placeholder] - Placeholder text
 * @param {boolean} [autoFocus] - Whether to autofocus
 * @param {object} [InputProps] - Props for the Input component
 * @param {object} [inputParams] - Additional input parameters
 * @param {function} [onBlur] - Callback when input loses focus
 * @param {boolean} [allowNegative=true] - Whether to allow negative numbers
 * @param {number} [decimalPlaces] - Number of decimal places to round to
 * @param {number} [min] - Minimum allowed value
 * @param {number} [max] - Maximum allowed value
 */
const NumberInput = ({
  value,
  onChange,
  fullWidth = true,
  sx,
  size = "medium",
  placeholder,
  autoFocus,
  InputProps,
  inputParams,
  onBlur,
  allowNegative = true,
  decimalPlaces,
  min,
  max,
  ...rest
}) => {
  const styles = useMemo(() => {
    return {
      "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
        {
          "-webkit-appearance": "none",
          margin: 0,
        },
      "& input[type=number]": {
        "-moz-appearance": "textfield",
      },
      ...sx,
    };
  }, [sx]);

  // Format the value for display
  const displayValue = useMemo(() => {
    if (isNil(value)) return "";

    // If decimalPlaces is specified, round to that many places
    if (
      isNumber(decimalPlaces) &&
      isFinite(decimalPlaces) &&
      decimalPlaces >= 0
    ) {
      const factor = Math.pow(10, decimalPlaces);
      return String(Math.round(value * factor) / factor);
    }

    return String(value);
  }, [value, decimalPlaces]);

  // Handle input changes
  const handleChange = (e) => {
    const inputValue = e?.target?.value;

    // Empty input
    if (inputValue === "") {
      onChange(null);
      return;
    }

    // Check if valid number pattern including decimal points
    // Allow negative sign at the beginning if allowNegative is true
    const regex = allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/;

    if (!regex.test(inputValue)) {
      return; // Invalid input, don't update
    }

    // Convert to number
    const numValue = parseFloat(inputValue);

    // Check if it's actually a number
    if (!isFinite(numValue)) {
      return; // Not a valid number
    }

    // Apply min/max constraints if specified
    if (isNumber(min) && numValue < min) {
      onChange(min);
      return;
    }

    if (isNumber(max) && numValue > max) {
      onChange(max);
      return;
    }

    // All checks passed, update the value
    onChange(numValue);
  };

  // Format value when input loses focus
  const handleBlur = (e) => {
    // If there's a value and decimalPlaces is specified, format on blur
    if (!isNil(value) && isNumber(decimalPlaces)) {
      const factor = Math.pow(10, decimalPlaces);
      const roundedValue = Math.round(value * factor) / factor;
      onChange(roundedValue);
    }

    if (onBlur) {
      onBlur(e);
    }
  };

  return (
    <TextField
      className="number-input"
      variant="outlined"
      value={displayValue}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      size={size}
      fullWidth={fullWidth}
      sx={styles}
      autoFocus={autoFocus}
      InputProps={InputProps}
      type="number"
      {...inputParams}
      {...rest}
    />
  );
};

export default NumberInput;
