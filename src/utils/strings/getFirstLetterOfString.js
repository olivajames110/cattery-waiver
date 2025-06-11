import { isString } from "lodash";

export const getFirstLetterOfString = (string) => {
  if (!isString(string)) {
    return "";
  }
  return string.substring(0, 1);
};
