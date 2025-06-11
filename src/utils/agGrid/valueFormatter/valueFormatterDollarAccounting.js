import { round } from "lodash";
import { formatDollar } from "../../../utils/numbers/formatDollar";

export const valueFormatterDollarAccounting = (params, returnVal) => {
  const value = params?.value;
  if (value == null) {
    return returnVal;
  }

  const rounded = Math.round(value); // Ensuring the value is rounded correctly

  // Format the number as a string with comma separators
  const formattedNumber = new Intl.NumberFormat("en-US").format(Math.abs(rounded));

  // Check if the number is negative and format accordingly
  if (rounded < 0) {
    return `(${formattedNumber})`;
  }

  return formattedNumber;
};
