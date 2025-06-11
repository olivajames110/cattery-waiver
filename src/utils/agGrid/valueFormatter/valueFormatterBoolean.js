import { isBoolean, isNil } from "lodash";

export const valueFormatterBoolean = (params) => {
  if (isNil(params?.value)) {
    return false;
  }

  if (isBoolean(params?.value) && params?.value) {
    return true;
  }
  return false;
};
