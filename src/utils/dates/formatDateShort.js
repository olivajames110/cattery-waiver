import { format, isValid } from "date-fns";
import { isString } from "lodash";
import { isoToDate } from "./isoToDate";

export const formatDateShort = (d) => {
  let dateObject;

  // format(new Date(), "M-d-yy");
  if (isString(d)) {
    const isoConverted = isoToDate(d);
    dateObject = isoConverted;
  }

  if (!isValid(dateObject)) {
    console.warn("Date is not valid", dateObject);
    return;
  }

  return format(dateObject, "M/d/yyyy");
};
