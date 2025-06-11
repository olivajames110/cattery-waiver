import { isBoolean, isNil } from "lodash";

export const valueFormatterBooleanYN = (params) => {
  if (isNil(params?.value)) {
    return "No";
  }

  if (isBoolean(params?.value) && params?.value) {
    return "Yes";
  }
  return "No";
};
