import React, { useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";

import { VALIDATOR_REQUIRE } from "../validators/VALIDATOR_REQUIRE";

import SelectToggleInput from "../../inputs/SelectToggleInput";

const RffSelectMultipleToggleField = ({
  name,
  label,
  options,
  required,
  suppressGrid,
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
          <SelectToggleInput
            label={label}
            value={input?.value}
            onChange={(v) => {
              input.onChange(v);
            }}
            exclusive={false}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            options={options}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffSelectMultipleToggleField;
