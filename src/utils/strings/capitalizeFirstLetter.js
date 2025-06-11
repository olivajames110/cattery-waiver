import { isString } from "lodash";

export const capitalizeFirstLetter = (str) => {
  if (!isString(str)) {
    return "";
  }
  return str.charAt(0).toUpperCase() + str.slice(1);
};
