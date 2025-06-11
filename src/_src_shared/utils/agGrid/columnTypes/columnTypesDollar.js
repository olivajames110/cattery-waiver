// Import lodash for type checking
import _ from "lodash";

export const columnTypesDollar = (params = {}) => {
  const { suppressFilter } = params;
  return {
    dollar: {
      // For display formatting
      valueFormatter: valueFormatterDollar,

      // For filtering
      filter: suppressFilter ? undefined : "agNumberColumnFilter",

      // For pivot operations
      aggFunc: "sum",
      allowedAggFuncs: ["sum", "min", "max", "avg"],

      width: 150,
      // For proper number conversion
      valueParser: valueParserDollar,

      // Add valueGetter to ensure numeric values are used in calculations
      valueGetter: valueGetterDollar,
    },
  };
};

// VALUE GETTER: Ensures the grid uses numeric values for operations
const valueGetterDollar = (params) => {
  if (_.isNil(params.data) || _.isNil(params.colDef.field)) {
    return null;
  }

  const rawValue = params.data[params.colDef.field];
  if (_.isNil(rawValue)) {
    return null;
  }

  // Always convert to number for internal operations
  return parseNumericValue(rawValue);
};

// VALUE PARSER: For editing and user input
const valueParserDollar = (params) => {
  if (_.isNil(params.newValue)) {
    return null;
  }

  if (_.isString(params.newValue)) {
    // Remove currency symbols and commas
    const cleanValue = params.newValue.replace(/[^0-9.-]+/g, "");
    return parseFloat(cleanValue);
  }

  return _.isNumber(params.newValue) ? params.newValue : null;
};

// VALUE FORMATTER: For display
const valueFormatterDollar = (params, returnVal = "") => {
  if (_.isNil(params.value)) {
    return returnVal;
  }

  // Format as currency regardless of context (normal or pivot)
  return formatDollar(params.value, returnVal);
};

// DOLLAR FORMATTER: Converts numbers to currency strings
const formatDollar = (value, returnVal = "") => {
  if (_.isNil(value)) {
    return returnVal;
  }

  // Ensure we're working with a number
  const numericValue = parseNumericValue(value);
  if (_.isNaN(numericValue)) {
    return returnVal;
  }

  // Format with Intl.NumberFormat for display
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericValue);
};

// NUMERIC VALUE PARSER: Central conversion function
const parseNumericValue = (value) => {
  if (_.isNil(value)) {
    return NaN;
  }

  if (_.isNumber(value)) {
    return value;
  }

  if (_.isString(value)) {
    // Handle strings like "579000.0000"
    const parsed = parseFloat(value.replace(/[^0-9.-]+/g, ""));
    return _.isNaN(parsed) ? NaN : parsed;
  }

  return NaN;
};
