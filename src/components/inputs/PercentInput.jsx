import React, { useMemo } from "react";

import { PercentOutlined } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import { isNil } from "lodash";
import { NumericFormat } from "react-number-format";

const PercentInput = ({
  value,
  onChange,
  fullWidth = true,
  sx,
  size = "medium",
  disabled,
  onBlur,
  placeholder = "Enter percentage",
  inputParams,
  ...rest
}) => {
  const styles = useMemo(() => {
    return {
      ...sx,
    };
  }, [sx]);

  return (
    <TextField
      className="percent-input"
      value={value ?? ""}
      onChange={onChange}
      placeholder={placeholder}
      size={size}
      onBlur={onBlur}
      fullWidth={fullWidth}
      sx={styles}
      disabled={disabled}
      InputProps={{
        inputComponent: NumberFormatCustom,
        // endAdornment: (
        //   <InputAdornment position="end">
        //     <PercentOutlined fontSize="small" className="thin" />
        //   </InputAdornment>
        // ),
      }}
      {...inputParams}
      {...rest}
    />
  );
};

const NumberFormatCustom = React.forwardRef(
  function NumberFormatCustom(props, ref) {
    const { input, inputRef, onChange, value, ...other } = props;

    return (
      <NumericFormat
        {...other}
        suffix="%"
        decimalSeparator="."
        onValueChange={(values) => {
          const { floatValue } = values;

          if (floatValue === undefined) {
            onChange(undefined);
            return;
          }
          const converted = (floatValue / 100).toFixed(4);
          onChange(Number(converted));
        }}
        value={isNil(value) || value === "" ? null : (value * 100).toFixed(2)}
        valueIsNumericString={value !== null && value !== undefined}
        getInputRef={ref || inputRef}
      />
    );
  }
);
export default PercentInput;
