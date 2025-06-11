import { isNumber } from "lodash";

const formatNumber = (number) => {
  if (!isNumber(number)) {
    return number;
  }
  return number.toLocaleString();
};

export default formatNumber;
