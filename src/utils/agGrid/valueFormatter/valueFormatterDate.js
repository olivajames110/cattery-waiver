import { isNil, isString } from "lodash";
import { formatDateShort } from "../../../utils/dates/formatDateShort";

export const valueFormatterDate = (params, returnValue) => {
  const d = params?.value;

  if (isNil(d) || !isString(d)) {
    return returnValue;
  }

  return formatDateShort(d);
};
