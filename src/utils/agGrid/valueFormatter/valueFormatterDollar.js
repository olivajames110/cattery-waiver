import { formatDollar } from "../../../utils/numbers/formatDollar";

export const valueFormatterDollar = (params, returnVal) => {
  return formatDollar(params?.value, returnVal);
};
