import React, { useEffect, useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";
import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { isBoolean } from "lodash";
import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import { FIELD_TYPES, useFormContext } from "../../../context/FormContext";

const RffBooleanCheckbox = ({
  name,
  label,
  required,
  suppressGrid,
  size,
  helperText,
  sx,
}) => {
  // Get the form context to register this field's type
  const { registerFieldType } = useFormContext();

  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );

  // Register the field type when the component mounts
  useEffect(() => {
    if (name) {
      registerFieldType(name, FIELD_TYPES.BOOLEAN_CHECKBOX);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name]);

  return (
    <RffInputWrapper
      suppressGrid={suppressGrid}
      size={size}
      required={required}
      helperText={helperText}
    >
      <Field
        name={name}
        validate={validate}
        render={({ input, meta }) => (
          <>
            <FormControlLabel
              sx={{
                span: {
                  fontSize: "13px !important",
                },
              }}
              control={
                <Checkbox
                  defaultChecked={!isBoolean(input.value) ? false : input.value}
                  size="small"
                  {...input}
                  onChange={(event) => {
                    // Immediately trigger change for checkboxes
                    input.onChange(event.target.checked);
                  }}
                  // Store the field type in the input data for AutoSaveFinalForm to detect
                  data-type={FIELD_TYPES.BOOLEAN_CHECKBOX}
                />
              }
              label={label}
            />
            {meta.touched && meta.error && (
              <FormHelperText sx={{ ml: 3 }} error>
                {meta.error}
              </FormHelperText>
            )}
          </>
        )}
      />
    </RffInputWrapper>
  );
};

export default RffBooleanCheckbox;
// import React, { useMemo } from "react";
// import { Field } from "react-final-form";

// import RffInputWrapper from "../shared/RffInputWrapper";

// import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
// import { isBoolean } from "lodash";
// import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";

// const RffBooleanCheckbox = ({
//   name,
//   label,
//   required,
//   suppressGrid,
//   size,
//   helperText,
//   sx,
// }) => {
//   const validate = useMemo(
//     () => (required ? VALIDATOR_REQUIRE : undefined),
//     [required]
//   );

//   return (
//     <RffInputWrapper
//       suppressGrid={suppressGrid}
//       size={size}
//       required={required}
//       helperText={helperText}
//     >
//       <Field
//         name={name}
//         validate={validate}
//         render={({ input, meta }) => (
//           <>
//             <FormControlLabel
//               sx={{
//                 span: {
//                   // color: "#2b2266",
//                   fontSize: "13px !important",
//                 },
//               }}
//               control={
//                 <Checkbox
//                   defaultChecked={!isBoolean(input.value) ? false : input.value}
//                   size="small"
//                   {...input}
//                   onChange={(event) => {
//                     input.onChange(event.target.checked);
//                   }}
//                 />
//               }
//               label={label}
//             />
//             {meta.touched && meta.error && (
//               <FormHelperText sx={{ ml: 3 }} error>
//                 {meta.error}
//               </FormHelperText>
//             )}
//           </>
//         )}
//       />
//     </RffInputWrapper>
//   );
// };

// export default RffBooleanCheckbox;
