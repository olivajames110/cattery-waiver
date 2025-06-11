import { isString } from "lodash";

export const isoToDate = (isoString) => {
  // Handle empty or non-string values
  if (!isoString || !isString(isoString)) {
    // console.warn("Invalid ISO input:", isoString);
    return null;
  }

  // Try to create a date object
  const date = new Date(isoString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn("Invalid ISO string format:", isoString);
    return null;
  }

  return date;
};
// export const isoToDate = (isoString) => {
//   if (!isString(isoString)) {
//     console.warn("ISO is not string:", isoString);
//     return null;
//   }
//   const date = new Date(isoString);
//   if (isNaN(date.getTime())) {
//     throw new Error("Invalid input: Expected a valid ISO string.");
//   }
//   return date;
// };
