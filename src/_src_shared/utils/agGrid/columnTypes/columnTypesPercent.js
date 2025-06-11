// Import only the specific lodash functions we need
import isNil from "lodash/isNil";
import isString from "lodash/isString";
import isNumber from "lodash/isNumber";
import isNaN from "lodash/isNaN";

/**
 * Smart percent column type for AG Grid
 * Handles both LTV and interest rate formatting with special rules
 * @param {Object} params - Configuration parameters
 * @param {boolean} params.suppressFilter - Whether to suppress the filter
 * @returns {Object} Column type definition
 */
export const columnTypesPercent = (params = {}) => {
  const { suppressFilter = false } = params;

  return {
    percent: {
      width: 140,
      // For display formatting
      valueFormatter: valueFormatterPercent,

      // For filtering
      filter: suppressFilter ? undefined : "agNumberColumnFilter",
      filterParams: {
        comparator: filterParamsPercentComparator,
      },

      // For editing
      valueParser: valueParserPercent,

      // For pivot operations
      aggFunc: "avg",
      allowedAggFuncs: ["avg", "min", "max", "sum"],

      // Add valueGetter to ensure numeric values are used in calculations
      valueGetter: valueGetterPercent,
    },
  };
};

// VALUE GETTER: Ensures the grid uses numeric values for operations
const valueGetterPercent = (params) => {
  if (isNil(params.data) || isNil(params.colDef.field)) {
    return null;
  }

  const rawValue = params.data[params.colDef.field];
  if (isNil(rawValue)) {
    return null;
  }

  // Always convert to number for internal operations
  return parseNumericValue(rawValue);
};

// Smart formatter for percentage values with field-specific rules
export const valueFormatterPercent = (params, returnVal = "") => {
  if (isNil(params.value)) {
    return returnVal;
  }

  // Try to access the original string value for precision preservation
  let originalValue;
  if (params.data && params.colDef?.field) {
    originalValue = params.data[params.colDef.field];
  } else {
    originalValue = params.value;
  }

  // For pivot mode rows, use numeric formatting
  const isPivotMode = params.node?.rowPinned === "pivot" || params.node?.group;

  // Get the field name
  const fieldName = params.colDef?.field;

  // Handle interest rate field
  if (fieldName === "interestRatePercent" && !isPivotMode) {
    // For interest rate: display exactly as in the raw data
    // Check if we can access the original value
    if (isString(originalValue)) {
      // Clean the original value
      const numericPart = originalValue.replace(/[^0-9.-]+/g, "");

      // Parse as a number to handle formatting
      const numValue = parseFloat(numericPart);

      // Check for trailing zeros in the original string
      const hasTrailingZeros = numericPart.includes(".");
      const decimalPart = hasTrailingZeros ? numericPart.split(".")[1] : "";

      // If third decimal is non-zero, show 3 decimals
      if (decimalPart.length >= 3 && decimalPart.charAt(2) !== "0") {
        return numValue.toFixed(3) + "%";
      } else {
        // Otherwise, show exactly 2 decimals
        return numValue.toFixed(2) + "%";
      }
    }

    // Fallback if we can't access the original string
    const numericValue = parseNumericValue(params.value);
    // Multiply by 100 because it's stored as decimal (0.0625 not 6.25)
    const percentValue = numericValue * 100;
    return percentValue.toFixed(3) + "%";
  }

  // Handle LTV field
  if (fieldName === "loanToValueLtv" && !isPivotMode) {
    // For LTV: if 3rd decimal is 0, show 2 decimals; otherwise show 3
    // Process the original value if possible
    if (isString(originalValue)) {
      // Clean the original string
      const numericPart = originalValue.replace(/[^0-9.-]+/g, "");

      // Parse as a number
      const numValue = parseFloat(numericPart);

      // Get the decimal portion
      const parts = numericPart.split(".");
      if (parts.length === 1) {
        // No decimal part
        return numValue.toFixed(2) + "%";
      }

      const decimalPart = parts[1];
      // Check third decimal place if it exists
      if (decimalPart.length >= 3) {
        const thirdDecimal = decimalPart.charAt(2);
        if (thirdDecimal === "0") {
          // Third decimal is zero, show only 2 decimals
          return numValue.toFixed(2) + "%";
        } else {
          // Third decimal is non-zero, show 3 decimals
          return numValue.toFixed(3) + "%";
        }
      } else {
        // Less than 3 decimal places
        return numValue.toFixed(2) + "%";
      }
    }

    // Fallback to numeric processing
    const numericValue = parseNumericValue(params.value);
    const percentValue = numericValue * 100;

    // Convert to string to check decimal places
    const valueStr = percentValue.toString();
    const parts = valueStr.split(".");

    if (parts.length === 1) {
      // No decimal part
      return percentValue.toFixed(2) + "%";
    }

    // Check third decimal place if it exists
    if (parts[1].length >= 3) {
      const thirdDecimal = parts[1].charAt(2);
      if (thirdDecimal === "0") {
        // Third decimal is zero, show only 2 decimals
        return percentValue.toFixed(2) + "%";
      } else {
        // Third decimal is non-zero, show 3 decimals
        return percentValue.toFixed(3) + "%";
      }
    } else {
      // Less than 3 decimal places
      return percentValue.toFixed(2) + "%";
    }
  }

  // DEFAULT BEHAVIOR: For other percentage fields or pivot rows
  const numericValue = parseNumericValue(params.value);
  if (isNaN(numericValue)) {
    return returnVal;
  }

  // Format with standard percentage formatting
  return new Intl.NumberFormat("en-US", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(numericValue);
};

// Parse percentage values for editing
export const valueParserPercent = (params) => {
  if (isNil(params.newValue)) {
    return null;
  }

  if (isString(params.newValue)) {
    // Remove percentage symbol and other non-numeric characters
    const cleanValue = params.newValue.replace(/[^0-9.-]+/g, "");
    // Convert to raw decimal value (if input has percentage format)
    return parseFloat(cleanValue) / 100;
  }

  return isNumber(params.newValue) ? params.newValue : null;
};

// Convert various input types to numeric values
const parseNumericValue = (value) => {
  if (isNil(value)) {
    return NaN;
  }

  if (isNumber(value)) {
    return value;
  }

  if (isString(value)) {
    // Remove non-numeric characters except decimal points and negative signs
    const cleaned = value.replace(/[^0-9.-]+/g, "");
    // Convert to number - assume it's already in decimal form (not percentage)
    return parseFloat(cleaned) / 100;
  }

  return NaN;
};

// Custom comparator for percentage filtering
const filterParamsPercentComparator = (filterValue, cellValue) => {
  // Use lodash to validate input types
  if (!isNumber(filterValue)) {
    return 0; // Treat invalid filterValue as equal
  }
  if (!isNumber(cellValue)) {
    return 0; // Treat invalid cellValue as equal
  }

  // Convert filterValue (e.g., 67.37) to raw data value (e.g., 0.6737)
  const rawFilterValue = filterValue / 100;

  if (cellValue < rawFilterValue) {
    return -1; // Cell value is less than the filter value
  }
  if (cellValue > rawFilterValue) {
    return 1; // Cell value is greater than the filter value
  }
  return 0; // Values are equal
};
