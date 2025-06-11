import React, { useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";

import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import TextInput from "../../inputs/TextInput";

const RffTextareaField = ({
  name,
  label,
  subLabel,
  required,
  suppressGrid,
  placeholder = "Enter value",
  size,
  disabled,
  helperText,
  onBlur,
  rows = 6,
  minHeight,
}) => {
  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );

  return (
    <RffInputWrapper
      label={label}
      suppressGrid={suppressGrid}
      size={size}
      required={required}
      helperText={helperText}
      subLabel={subLabel}
    >
      <Field
        name={name}
        validate={validate}
        render={({ input, meta }) => (
          <TextInput
            {...input}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            multiline
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            minRows={1}
            maxRows={rows}
            size="medium"
            InputProps={{
              style: {
                ...(minHeight ? { minHeight } : {}),
                alignItems: "flex-start", // This aligns the text to the top
              },
              inputProps: {
                style: {
                  verticalAlign: "top", // This helps with vertical alignment in the textarea
                },
              },
            }}
          />
        )}
      />
    </RffInputWrapper>
  );
};
// const RffTextareaField = ({
//   name,
//   label,
//   required,
//   suppressGrid,
//   placeholder = "Enter value",
//   size,
//   disabled,
//   helperText,
//   onBlur,
//   rows = 6,
// }) => {
//   const validate = useMemo(
//     () => (required ? VALIDATOR_REQUIRE : undefined),
//     [required]
//   );

//   return (
//     <RffInputWrapper
//       label={label}
//       suppressGrid={suppressGrid}
//       size={size}
//       required={required}
//       helperText={helperText}
//     >
//       <Field
//         name={name}
//         validate={validate}
//         render={({ input, meta }) => (
//           <TextInput
//             {...input}
//             error={meta.touched && !!meta.error}
//             helperText={meta.touched && meta.error}
//             multiline
//             onBlur={onBlur}
//             placeholder={placeholder}
//             disabled={disabled}
//             // InputProps={{ rows: rows }}

//             minRows={1}
//             maxRows={rows} // or however many rows you want as a max
//             size="medium" // keeps the same 'visual size' as a normal TextField
//             // {...otherProps}
//           />
//         )}
//       />
//     </RffInputWrapper>
//   );
// };

export default RffTextareaField;
