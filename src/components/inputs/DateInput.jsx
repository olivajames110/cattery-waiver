import React, { useMemo } from "react";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { isValid } from "date-fns";
import { isNil } from "lodash";

const DateInput = ({
  value,
  onChange,
  onBlur,
  disabled,
  onAccept,
  sx,
  ...rest
}) => {
  const convertDateToIsoString = (isoString) => {
    if (isNil(isoString)) {
      return null;
    }
    let date = new Date(isoString);
    if (date instanceof Date && !isNaN(date)) {
      return date.toISOString();
    }
    return null;
  };

  const styles = useMemo(() => {
    return {
      ".MuiButtonBase-root": {
        borderRadius: "0px",
        borderLeft: "1px solid #dddddd",
        marginRight: "-14px",
      },
      ...sx,
    };
  }, [sx]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        disabled={disabled}
        sx={styles}
        value={isValid(new Date(value)) ? new Date(value) : null}
        onAccept={(date) => {
          if (isNil(onAccept)) {
            return;
          }
          if (isValid(date)) {
            onAccept(convertDateToIsoString(date));
          } else {
            onAccept(null);
          }
        }}
        onChange={(date) => {
          if (isValid(date)) {
            onChange(convertDateToIsoString(date));
          } else {
            onChange(null);
          }
        }}
        slotProps={{
          textField: { fullWidth: true, onBlur, ...rest },
          desktopPaper: {
            sx: {
              borderRadius: "14px",
              button: {
                fontSize: "14px",
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};

export default DateInput;
