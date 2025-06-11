import React, { useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";

import { useSelector } from "react-redux";
import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import SelectAutoInput from "../../inputs/SelectAutoInput";
import SelectUserEmailInput from "../../inputs/SelectUserEmailInput";

const RffSelectUserEmailField = ({
  name,
  label,

  required,
  disabled,
  suppressGrid,
  size,
  sx,
}) => {
  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );
  // const users = useSelector((state) => state?.users);
  // const selectOptionsUserEmailOptions = useMemo(
  //   () =>
  //     (users || [])
  //       .map((user) => ({
  //         label: user?.fullName,
  //         optionLabel: `${user?.fullName} <${user?.emailAddress}>`,
  //         value: user?.emailAddress,
  //       }))
  //       .sort((a, b) => a.label.localeCompare(b.label)),
  //   [users]
  // );

  return (
    <RffInputWrapper
      label={label}
      suppressGrid={suppressGrid}
      size={size}
      required={required}
    >
      <Field
        name={name}
        validate={validate}
        render={({ input, meta }) => (
          <SelectUserEmailInput
            label={label}
            value={input?.value}
            // options={selectOptionsUserEmailOptions}
            onChange={(v) => {
              input.onChange(v);
            }}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      />
    </RffInputWrapper>
  );
  // return (
  //   <RffInputWrapper
  //     label={label}
  //     suppressGrid={suppressGrid}
  //     size={size}
  //     required={required}
  //   >
  //     <Field
  //       name={name}
  //       validate={validate}
  //       render={({ input, meta }) => (
  //         <SelectAutoInput
  //           label={label}
  //           value={input?.value}
  //           options={selectOptionsUserEmailOptions}
  //           onChange={(v) => {
  //             input.onChange(v);
  //           }}
  //           error={meta.touched && !!meta.error}
  //           helperText={meta.touched && meta.error}
  //         />
  //       )}
  //     />
  //   </RffInputWrapper>
  // );
};

export default RffSelectUserEmailField;
