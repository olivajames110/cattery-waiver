import { size } from "lodash";

export const valueFormatterArrayCount = (params) => {
  return size(params?.value);
};
