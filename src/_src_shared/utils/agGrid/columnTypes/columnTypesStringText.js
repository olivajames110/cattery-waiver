import { valueFormatterDate } from "../../../../utils/agGrid/valueFormatter/valueFormatterDate";

export const columnTypesStringText = () => {
  return {
    string: {},
    text: {},
  };
};

// const filterParamsDate = {
//   // provide comparator function
//   comparator: (filterLocalDateAtMidnight, cellValue) => {
//     if (cellValue == null) {
//       return 0;
//     }

//     const selected_date = endOfDay(filterLocalDateAtMidnight);
//     const cellDate = endOfDay(new Date(cellValue));

//     // Now that both parameters are Date objects, we can compare
//     if (isBefore(cellDate, selected_date)) {
//       return -1;
//     }
//     if (isEqual(cellDate, selected_date)) {
//       return 0;
//     }
//     if (isAfter(cellDate, selected_date)) {
//       return 1;
//     }

//     return 0;
//   },
// };
