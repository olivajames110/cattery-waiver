import { isNumber } from "lodash";
import { valueFormatterPercent } from "../valueFormatter/valueFormatterPercent";
import { valueParserPercent } from "../valueParser/valueParserPercent";

export const columnTypesPercent = (params = {}) => {
  const { suppressFilter } = params;
  return {
    percent: {
      width: 160,
      valueFormatter: valueFormatterPercent,
      valueParser: valueParserPercent,
      filter: suppressFilter ? undefined : "agNumberColumnFilter",
      filterParams: {
        comparator: filterParamsPercentComparator, // Custom comparator for percentage
      },
    },
  };
};
const filterParamsPercentComparator = (filterValue, cellValue) => {
  console.log(
    "filterValue, cellValuefilterValue, cellValue",
    filterValue,
    cellValue
  );
  // Use lodash to validate input types
  if (!isNumber(filterValue)) {
    console.error(
      "Invalid filterValue provided to percentComparator:",
      filterValue
    );
    return 0; // Treat invalid filterValue as equal to prevent unintended filtering
  }
  if (!isNumber(cellValue)) {
    console.error(
      "Invalid cellValue provided to percentComparator:",
      cellValue
    );
    return 0; // Treat invalid cellValue as equal
  }

  // Convert filterValue (e.g., 4.10) to raw data value (e.g., 0.0410)
  const rawFilterValue = filterValue / 100;

  if (cellValue < rawFilterValue) {
    return -1; // Cell value is less than the filter value
  }
  if (cellValue > rawFilterValue) {
    return 1; // Cell value is greater than the filter value
  }
  return 0; // Values are equal
};
