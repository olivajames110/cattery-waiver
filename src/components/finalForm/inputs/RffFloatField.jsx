import React, { useMemo } from "react";
import { Field } from "react-final-form";

import TextInput from "../../inputs/TextInput";
import RffInputWrapper from "../shared/RffInputWrapper";

import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";

const RffFloatField = ({
  name,
  label,
  required,
  placeholder = "Enter value",
  suppressGrid,
  disabled,
  onBlur,
  size,
  sx,
  suffix, // Optional suffix like "x" for DSCR
  prefix, // Optional prefix like "$" for dollar amounts
  precision = 2, // Number of decimal places
  helperText, // Optional helper text
}) => {
  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );

  const formatFloat = (value) => {
    if (value === undefined || value === null || value === "") return "";

    // If it's a string that looks like the user is typing, return as-is
    const valueStr = String(value);
    if (
      valueStr.endsWith(".") ||
      valueStr.endsWith(".0") ||
      valueStr.endsWith("-.")
    ) {
      return valueStr;
    }

    // Parse the value to ensure it's a number
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;

    // Format with specified precision only if it's a valid complete number
    let formatted = numValue.toFixed(precision);

    // Remove trailing zeros after decimal point
    if (formatted.includes(".")) {
      formatted = formatted.replace(/\.?0+$/, "");
    }

    // Add prefix/suffix if provided
    if (prefix) formatted = `${prefix}${formatted}`;
    if (suffix) formatted = `${formatted}${suffix}`;

    return formatted;
  };

  const parseFloatValue = (value) => {
    if (value === undefined || value === null || value === "") return undefined;

    // Convert to string and trim
    let cleanedValue = String(value).trim();

    // Remove prefix if present
    if (prefix && cleanedValue.startsWith(prefix)) {
      cleanedValue = cleanedValue.slice(prefix.length);
    }

    // Remove suffix if present
    if (suffix && cleanedValue.endsWith(suffix)) {
      cleanedValue = cleanedValue.slice(0, -suffix.length);
    }

    // Remove any non-numeric characters except . and -
    cleanedValue = cleanedValue.replace(/[^0-9.-]/g, "");

    // Return the string as-is if user is in the middle of typing
    if (
      cleanedValue === "" ||
      cleanedValue === "." ||
      cleanedValue === "-" ||
      cleanedValue === "-."
    ) {
      return cleanedValue;
    }

    // For incomplete decimals, return as string to preserve typing
    if (cleanedValue.endsWith(".")) {
      return cleanedValue;
    }

    const parsed = parseFloat(cleanedValue);
    return isNaN(parsed) ? cleanedValue : parsed;
  };

  return (
    <RffInputWrapper
      label={label}
      suppressGrid={suppressGrid}
      size={size}
      required={required}
    >
      <Field
        name={name}
        parse={parseFloatValue}
        format={formatFloat}
        validate={validate}
        render={({ input, meta }) => (
          <TextInput
            {...input}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error ? meta.error : helperText}
            inputMode="decimal" // ✅ Ensures decimal keyboard on mobile
            type="text" // ✅ Allows for suffix/prefix display
            sx={sx}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffFloatField;
