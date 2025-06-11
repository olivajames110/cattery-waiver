import { formatPercent } from "../../../utils/numbers/formatPercent";

export const valueFormatterPercent = (params) => {
  return formatPercent(params?.value);
};
