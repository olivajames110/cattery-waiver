import React, { useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";

import SelectMultipleInput from "../../inputs/SelectMultipleInput";
import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";

const RffSelectMultipleField = ({
  name,
  label,
  options,
  required,
  suppressGrid,
  helperText,
  size,
  sx,
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
    >
      <Field
        name={name}
        validate={validate}
        render={({ input, meta }) => (
          <SelectMultipleInput
            label={label}
            value={input?.value}
            onChange={(v) => {
              input.onChange(v);
            }}
            error={meta.touched && !!meta.error}
            helperText={(meta.touched && meta.error) || helperText}
            options={options}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffSelectMultipleField;
