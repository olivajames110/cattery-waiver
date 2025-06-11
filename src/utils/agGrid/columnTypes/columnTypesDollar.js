import { valueFormatterDollar } from "../valueFormatter/valueFormatterDollar";

export const columnTypesDollar = (params = {}) => {
  const { suppressFilter } = params;
  return {
    dollar: {
      valueFormatter: valueFormatterDollar,
      filter: suppressFilter ? undefined : "agNumberColumnFilter",
    },
  };
};
