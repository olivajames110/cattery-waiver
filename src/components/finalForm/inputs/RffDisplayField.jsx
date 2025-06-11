import React, { useMemo } from "react";
import { Field } from "react-final-form";
import Tooltip from "@mui/material/Tooltip";

import Txt from "../../typography/Txt";
import RffInputWrapper from "../shared/RffInputWrapper";
import { isNil, isNumber, isString } from "lodash";

// Format value based on the provided type
const formatValueByType = (value, type) => {
  if (isNil(value) || value === "") return value;

  try {
    switch (type) {
      case "phone":
        // Format: (123) 456-7890
        return formatPhoneNumber(value);
      case "dollar":
        // Format: $1,234.56
        return `$${formatDollar(value)}`;
      case "percent":
        // Format: 12.34%
        return `${formatPercent(value)}%`;
      case "number":
        // Format: 1,234.56
        return formatNumber(value);
      case "date":
        // Format: MM/DD/YYYY
        return formatDate(value);
      default:
        return value;
    }
  } catch (error) {
    console.error(`Error formatting value as ${type}:`, error);
    return value;
  }
};

// Format helpers
const formatPhoneNumber = (value) => {
  if (!value) return value;

  // Convert to string and remove non-numeric characters
  const phoneNumber = String(value).replace(/\D/g, "");

  // Check if it's a valid 10-digit number
  if (phoneNumber.length === 10) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
  }

  // Return original value if not a valid phone number
  return value;
};

const formatDollar = (value) => {
  if (isNil(value)) return value;

  // Ensure value is a number
  const numValue = Number(value);

  if (isNaN(numValue)) return value;

  // Check if the cents are zero
  const hasCents = numValue % 1 !== 0;

  // Format as currency with or without decimal places based on cents
  if (hasCents) {
    return `${numValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  } else {
    return `${numValue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
};

const formatPercent = (value) => {
  if (isNil(value)) return value;

  // Ensure value is a number
  const numValue = Number(value);

  if (isNaN(numValue)) return value;

  // Format as percentage with 2 decimal places
  return `${numValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%`;
};

const formatNumber = (value) => {
  if (isNil(value)) return value;

  // Ensure value is a number
  const numValue = Number(value);

  if (isNaN(numValue)) return value;

  // Format number with commas for thousands
  return numValue.toLocaleString();
};

const formatDate = (value) => {
  if (!value) return value;

  try {
    // Try to convert to Date object
    const date = new Date(value);

    // Check if date is valid
    if (isNaN(date.getTime())) return value;

    // Format as MM/DD/YYYY
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();

    return `${month}/${day}/${year}`;
  } catch (error) {
    return value;
  }
};

const RffDisplayField = React.memo(function RffDisplayField({
  name,
  label,
  value,
  emptyValue = "—",
  suppressGrid,
  size,
  type, // New prop for value formatting
  data, // For accessing data directly
  maxWidth, // New prop for text truncation with ellipsis
}) {
  const cellColor = useMemo(() => "#33475b", []);
  const cellFontSize = useMemo(() => "12px", []);
  const cellValueFontWeight = useMemo(() => 600, []);

  const valueStyles = useMemo(() => {
    return {
      fontWeight: cellValueFontWeight,
      fontSize: cellFontSize,
      // color: cellColor,
      // "-webkit-text-fill-color": cellColor,
    };
  }, []);

  // Create ellipsis styles when maxWidth is provided
  const ellipsisStyles = useMemo(() => {
    if (!maxWidth) return {};

    return {
      maxWidth,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      display: "block",
    };
  }, [maxWidth]);

  // Create a wrapper component for text with tooltip when truncated
  const TextWithTooltip = ({ content, styles }) => {
    // Don't add tooltip if maxWidth is not provided
    if (!maxWidth) {
      return <Txt sx={{ ...styles }}>{content}</Txt>;
    }

    return (
      <Tooltip
        title={content}
        arrow
        placement="top"
        enterDelay={200}
        enterNextDelay={200}
      >
        <div style={{ display: "inline-block", width: "100%" }}>
          <Txt sx={{ ...styles, ...ellipsisStyles }}>{content}</Txt>
        </div>
      </Tooltip>
    );
  };

  // Handle the case when direct value is provided
  if (value !== undefined) {
    const displayValue =
      !isNumber(value) && !isString(value)
        ? "N/A"
        : type
          ? formatValueByType(value, type)
          : value;

    return (
      <RffInputWrapper label={label} suppressGrid={suppressGrid} size={size}>
        <TextWithTooltip content={displayValue} styles={valueStyles} />
      </RffInputWrapper>
    );
  }

  // Handle the case when data is provided and we need to access a field by name
  if (data && name && data[name] !== undefined) {
    const displayValue = type
      ? formatValueByType(data[name], type)
      : data[name];

    return (
      <RffInputWrapper label={label} suppressGrid={suppressGrid} size={size}>
        <TextWithTooltip content={displayValue} styles={valueStyles} />
      </RffInputWrapper>
    );
  }

  // Default field behavior from react-final-form
  return (
    <RffInputWrapper label={label} suppressGrid={suppressGrid} size={size}>
      <Field
        name={name}
        subscription={{ value: true, error: true, touched: true }}
        render={({ input, meta }) => {
          const displayValue =
            isNil(input?.value) || input?.value === ""
              ? emptyValue
              : type
                ? formatValueByType(input.value, type)
                : input.value;

          return (
            <TextWithTooltip content={displayValue} styles={valueStyles} />
          );
        }}
      />
    </RffInputWrapper>
  );
});

export default RffDisplayField;
