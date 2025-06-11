import { toNumber } from "lodash";

export const valueParserPercent = (params) => {
  const newValue = toNumber(params?.newValue);

  if (newValue > 1) {
    const converted = newValue / 100;

    return converted;
  }
  return newValue;
};
