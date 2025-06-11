import React, { useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";
import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import TextInput from "../../inputs/TextInput";

const RffTextField = React.memo(function RffTextField({
  name,
  label,
  required,
  placeholder = "Enter value",
  suppressGrid,
  size,
  helperText,
  disabled,
  onBlur, // This is the onBlur passed from enhanceFieldWithBlurHandler
  testing,
  sx,
}) {
  // Only re-create this validate function when "required" changes
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
      testing={testing}
    >
      <Field
        name={name}
        validate={validate}
        // 1) Only subscribe to the needed bits of Field state
        subscription={{ value: true, error: true, touched: true }}
        render={({ input, meta }) => {
          // Create a wrapped onBlur handler that combines React Final Form's input.onBlur
          // with the custom onBlur handler
          const handleBlur = (event) => {
            // First call the React Final Form's input.onBlur to update the form state
            input.onBlur(event);

            // Then call the custom onBlur if provided
            if (onBlur) {
              onBlur({
                field: name,
                newValue: input.value,
                oldValue: input.initialValue,
              });
            }
          };

          return (
            <TextInput
              {...input}
              sx={sx}
              // Replace the onBlur with our wrapped handler
              onBlur={onBlur}
              // onBlur={handleBlur}
              disabled={disabled}
              placeholder={placeholder}
              error={meta.touched && !!meta.error}
              helperText={(meta.touched && meta.error) || helperText}
            />
          );
        }}
      />
    </RffInputWrapper>
  );
});

export default RffTextField;
// import React, { useMemo } from "react";
// import { Field } from "react-final-form";

// import RffInputWrapper from "../shared/RffInputWrapper";
// import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
// import TextInput from "../../inputs/TextInput";

// const RffTextField = React.memo(function RffTextField({
//   name,
//   label,
//   required,
//   placeholder = "Enter value",
//   suppressGrid,
//   size,
//   disabled,
//   onBlur,
//   testing,
//   sx,
// }) {
//   // Only re-create this validate function when "required" changes
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
//       testing={testing}
//     >
//       <Field
//         name={name}
//         validate={validate}
//         // 1) Only subscribe to the needed bits of Field state
//         subscription={{ value: true, error: true, touched: true }}
//         render={({ input, meta }) => (
//           <TextInput
//             {...input}
//             sx={sx}
//             onBlur={onBlur}
//             disabled={disabled}
//             placeholder={placeholder}
//             error={meta.touched && !!meta.error}
//             helperText={meta.touched && meta.error}
//           />
//         )}
//       />
//     </RffInputWrapper>
//   );
// });

// export default RffTextField;
