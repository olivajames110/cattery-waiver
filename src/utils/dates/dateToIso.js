import { isValid } from "date-fns";

export const dateToIso = (date) => {
  if (!isValid(date)) {
    console.warn("Date is not valid:", date);
    return;
  }

  return date.toISOString();
};
