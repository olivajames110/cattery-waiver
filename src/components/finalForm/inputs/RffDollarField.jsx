import React, { useMemo } from "react";
import { Field } from "react-final-form";

import DollarInput from "../../inputs/DollarInput";
import RffInputWrapper from "../shared/RffInputWrapper";

import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";

const RffDollarField = ({
  name,
  label,
  required,
  helperText,
  placeholder,
  fullWidth,
  suppressGrid,
  onBlur,
  size,
  disabled,
}) => {
  // Custom validator that handles numeric values and empty values
  const validateDollarAmount = useMemo(() => {
    return (value) => {
      // Check if value is empty and required
      if (required && (value === undefined || value === null || value === "")) {
        return "This field is required";
      }

      return undefined; // No validation error
    };
  }, [required]);

  return (
    <RffInputWrapper
      label={label}
      suppressGrid={suppressGrid}
      size={size}
      required={required}
    >
      <Field
        name={name}
        validate={validateDollarAmount}
        parse={(value) => {
          // Convert empty string to undefined to handle empty input correctly
          if (value === "") return undefined;
          // Keep null values as null
          if (value === null) return null;
          // Otherwise maintain numeric values
          return value;
        }}
        render={({ input, meta }) => (
          <DollarInput
            {...input}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            fullWidth={fullWidth}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error ? meta.error : helperText}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffDollarField;
// import React, { useMemo } from "react";
// import { Field } from "react-final-form";

// import DollarInput from "../../inputs/DollarInput";
// import RffInputWrapper from "../shared/RffInputWrapper";

// import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";

// const RffDollarField = ({
//   name,
//   label,
//   required,
//   helperText,
//   placeholder,
//   fullWidth,
//   suppressGrid,
//   size,
//   disabled,
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
//     >
//       <Field
//         name={name}
//         validate={validate}
//         render={({ input, meta }) => (
//           <DollarInput
//             {...input}
//             placeholder={placeholder}
//             disabled={disabled}
//             fullWidth={fullWidth}
//             error={meta.touched && !!meta.error}
//             helperText={helperText}
//           />
//         )}
//       />
//     </RffInputWrapper>
//   );
// };

// export default RffDollarField;
