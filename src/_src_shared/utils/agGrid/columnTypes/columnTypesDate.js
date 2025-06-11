import { isEqual, isNil, isString } from "lodash";
import { valueFormatterDate } from "../../../../utils/agGrid/valueFormatter/valueFormatterDate";
import { isoToDate } from "../../../../utils/dates/isoToDate";
import {
  endOfDay,
  format,
  isAfter,
  isBefore,
  isValid,
  parseISO,
} from "date-fns";

export const columnTypesDate = () => {
  return {
    date: {
      // display formatter stays the same
      valueFormatter: valueFormatterDate,

      // Convert any input to ISO string format when value changes
      valueParser: (params) => {
        const v = params.newValue;
        let d;

        if (v instanceof Date) {
          d = v;
        } else if (isString(v)) {
          d = isoToDate(v);
        } else {
          return v;
        }

        // If we have a valid date, return it as an ISO string
        if (isValid(d)) {
          return d.toISOString();
        }

        return v;
      },

      numAlwaysVisibleConditions: 1,
      filter: "agDateColumnFilter",
      cellEditor: "agDateCellEditor",
      filterParams: filterParamsDate,
    },

    dateTime: {
      numAlwaysVisibleConditions: 1,
      valueFormatter: valueFormatterDateTime,
      filter: "agDateColumnFilter",
      filterParams: filterParamsDate,
    },
  };
};

const valueFormatterDateTime = (params, returnValue) => {
  const d = params?.value;
  if (isNil(d) || !isString(d)) {
    return returnValue;
  }
  return formatDateTime(d);
};

// Function to convert UTC date to Eastern Time (NY)
const convertToEasternTime = (date) => {
  // Create a date object in UTC
  const utcDate = new Date(date);

  // Check if the date is valid
  if (!isValid(utcDate)) {
    return null;
  }

  // Create a formatter to output the date in the Eastern timezone
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  });

  // Format the date in Eastern time
  const easternTimeStr = formatter.format(utcDate);

  // Parse the Eastern time string back to a Date object
  const [datePart, timePart] = easternTimeStr.split(", ");
  const [month, day, year] = datePart.split("/");
  const [hour, minute, second] = timePart.split(":");

  // Create a new Date object with the Eastern time components
  // Note: months are 0-indexed in JavaScript Date
  return new Date(year, month - 1, day, hour, minute, second);
};

export const formatDateTime = (isoString) => {
  if (!isoString) return "";

  try {
    // Convert the UTC time to Eastern Time
    const easternDate = convertToEasternTime(isoString);

    if (!easternDate) {
      console.warn("Invalid date:", isoString);
      return "";
    }

    // Format the date in Eastern time using date-fns
    return format(easternDate, "M/d/yyyy h:mm a");
  } catch (error) {
    console.error("Error formatting date:", error);
    return "";
  }
};

const filterParamsDate = {
  comparator: (filterLocalDateAtMidnight, cellValue) => {
    if (cellValue == null) {
      return 0;
    }
    const sel = endOfDay(filterLocalDateAtMidnight);
    const cellDate = endOfDay(new Date(cellValue));
    if (isBefore(cellDate, sel)) return -1;
    if (isEqual(cellDate, sel)) return 0;
    if (isAfter(cellDate, sel)) return 1;
    return 0;
  },
};
