import React, { useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";

import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";

import SelectToggleInput from "../../inputs/SelectToggleInput";

const RffBooleanToggleField = ({
  name,
  label,
  required,
  suppressGrid,
  size,
  fullWidth,
  toggleSize,
}) => {
  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );
  const options = useMemo(
    () => [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
    []
  );
  return (
    <RffInputWrapper
      label={label}
      suppressGrid={suppressGrid}
      size={size}
      fullWidth={fullWidth}
      required={required}
    >
      <Field
        name={name}
        validate={validate}
        render={({ input, meta }) => (
          <SelectToggleInput
            label={label}
            fullWidth={fullWidth}
            size={toggleSize}
            value={input?.value}
            onChange={(v) => {
              input.onChange(v);
            }}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            options={options}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffBooleanToggleField;
