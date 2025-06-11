import React, { useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";

import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import SelectInput from "../../inputs/SelectInput";

const RffSelectField = ({
  name,
  label,
  options,
  required,
  disabled,
  suppressGrid,
  size,
  helperText,
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
      helperText={helperText}
    >
      <Field
        name={name}
        validate={validate}
        render={({ input, meta }) => (
          <SelectInput
            label={label}
            value={input?.value}
            onChange={(v) => {
              input.onChange(v);
            }}
            disabled={disabled}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            options={options}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffSelectField;
