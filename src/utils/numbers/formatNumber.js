import { isNumber } from "lodash";

export const formatNumber = (number) => {
  if (!isNumber(number)) {
    return number;
  }
  return number.toLocaleString();
};
