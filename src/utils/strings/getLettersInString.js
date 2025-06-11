import { isNil, isString } from "lodash";

export const getLettersInString = (string, start = 0, end) => {
  if (!isString(string)) {
    return "";
  }

  const endValue = isNil(end) ? start : end;
  const startValue = isNil(end) ? start - 1 : start;
  return string.substring(startValue, endValue);
};
