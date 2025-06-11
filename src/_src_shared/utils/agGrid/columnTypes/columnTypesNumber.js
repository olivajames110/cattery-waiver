// src/_src_shared/utils/agGrid/columnTypes/columnTypesNumber.js
import isNil from "lodash/isNil";
import isNumber from "lodash/isNumber";

export const columnTypesNumber = () => {
  return {
    number: {
      // use AG’s built-in number filter
      filter: "agNumberColumnFilter",
      // show one condition by default (you can tweak or remove this)
      numAlwaysVisibleConditions: 1,
      // format for display (adds thousands separators)
      valueFormatter: valueFormatterNumber,
      // parse user edits back to a Number
      valueParser: numberValueParser,
      // cell editor stays as text so user can type freely
      cellEditor: "agTextCellEditor",
      // optional: show apply / reset buttons in the filter panel
      filterParams: {
        buttons: ["apply", "reset"],
      },
    },
  };
};

const valueFormatterNumber = (params) => {
  const v = params.value;
  if (isNil(v) || !isNumber(v)) return "";
  // toLocaleString uses the browser locale for separators
  return v.toLocaleString();
};

const numberValueParser = (params) => {
  const newValue = params.newValue;
  // empty → null
  if (newValue == null || newValue === "") return null;
  // strip out commas, parse float
  const parsed = parseFloat(newValue.toString().replace(/,/g, ""));
  return isNaN(parsed) ? null : parsed;
};
