import React, { useMemo } from "react";
import { TextField } from "@mui/material";
import { NumericFormat } from "react-number-format";

const DollarInput = ({
  value,
  onChange,
  onFocus,
  onBlur,
  name,
  fullWidth = true,
  sx,
  size = "medium",
  placeholder = "Enter dollar amount",
  disabled,
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
      className="basic-dollar-input"
      value={value ?? ""}
      onChange={onChange} // Keep this for React Final Form
      name={name}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      size={size}
      disabled={disabled}
      fullWidth={fullWidth}
      sx={styles}
      InputProps={{
        inputComponent: NumberFormatCustom,
        inputProps: {
          originalOnChange: onChange, // Pass the original onChange handler
        },
      }}
      // Remove type and pattern to avoid validation conflicts
      {...inputParams}
      {...rest}
    />
  );
};

const NumberFormatCustom = React.forwardRef(
  function NumberFormatCustom(props, ref) {
    const {
      inputRef,
      onChange, // This comes from TextField
      originalOnChange, // This is the React Final Form onChange
      ...other
    } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onValueChange={({ formattedValue, value, floatValue }) => {
          // Create a synthetic event for TextField
          const event = {
            target: {
              name: props.name,
              value: formattedValue,
            },
          };

          // Call the TextField's onChange (needed for controlled component behavior)
          if (onChange) {
            onChange(event);
          }

          // Call the Final Form's onChange with the numeric value
          if (originalOnChange) {
            // Use floatValue which will be null for empty input, preserving empty state
            originalOnChange(floatValue);
          }
        }}
        prefix="$"
        valueIsNumericString
        thousandSeparator
        decimalScale={2}
        allowNegative={false}
      />
    );
  }
);

export default DollarInput;
// import React, { useMemo } from "react";
// import { AttachMoneyOutlined } from "@mui/icons-material";
// import { InputAdornment, TextField } from "@mui/material";
// import { NumericFormat } from "react-number-format";

// const DollarInput = ({
//   value,
//   onChange,
//   fullWidth = true,
//   sx,
//   size = "medium",
//   placeholder = "Enter dollar amount",
//   disabled,
//   inputParams,
//   ...rest
// }) => {
//   const styles = useMemo(() => {
//     return {
//       ...sx,
//     };
//   }, [sx]);

//   return (
//     <TextField
//       className="basic-dollar-input"
//       value={value ?? ""}
//       onChange={onChange}
//       placeholder={placeholder}
//       size={size}
//       disabled={disabled}
//       fullWidth={fullWidth}
//       sx={styles}
//       InputProps={{
//         inputComponent: NumberFormatCustom,
//       }}
//       inputMode="numeric" // ✅ Triggers numeric keyboard on mobile
//       type="tel" // ✅ Best option for iOS numeric UI
//       pattern="[0-9]*" // ✅ Ensures numeric input on mobile
//       {...inputParams}
//       {...rest}
//     />
//   );
// };

// const NumberFormatCustom = React.forwardRef(
//   function NumberFormatCustom(props, ref) {
//     const { inputRef, onChange, ...other } = props;

//     return (
//       <NumericFormat
//         {...other}
//         getInputRef={ref}
//         onValueChange={({ formattedValue, floatValue }) => {
//           // Create an event-like object that React Final Form expects
//           // This simulates a standard input change event
//           onChange({
//             target: {
//               value: formattedValue, // Use the formatted string value instead of the float
//             },
//           });
//         }}
//         prefix="$"
//         valueIsNumericString
//         thousandSeparator
//         inputMode="numeric"
//         type="tel"
//         pattern="[0-9]*"
//       />
//     );
//   }
// );

// // const NumberFormatCustom = React.forwardRef(
// //   function NumberFormatCustom(props, ref) {
// //     const { inputRef, onChange, ...other } = props;

// //     return (
// //       <NumericFormat
// //         {...other}
// //         getInputRef={ref}
// //         onValueChange={({ floatValue }) => {
// //           onChange(floatValue);
// //         }}
// //         prefix="$"
// //         valueIsNumericString
// //         thousandSeparator
// //         inputMode="numeric" // ✅ Ensures correct keyboard on mobile
// //         type="tel" // ✅ Works well on iOS
// //         pattern="[0-9]*" // ✅ Helps enforce numeric input
// //       />
// //     );
// //   }
// // );

// export default DollarInput;
