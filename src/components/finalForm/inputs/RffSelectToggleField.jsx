import React, { useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";

import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";

import SelectToggleInput from "../../inputs/SelectToggleInput";

const RffSelectToggleField = ({
  name,
  label,
  options,
  required,
  suppressGrid,
  size,
  toggleSize,
  disabled,
  onChange,
  sx,
  helperText,
  testing,
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
      testing={testing}
      required={required}
      helperText={helperText}
    >
      <Field
        name={name}
        validate={validate}
        render={({ input, meta }) => (
          <SelectToggleInput
            label={label}
            value={input?.value}
            disabled={disabled}
            onChange={(v) => {
              input.onChange(v);
              if (onChange) {
                onChange(v);
              }
            }}
            // sx={{ mt: 1 }}
            size={toggleSize}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            options={options}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffSelectToggleField;
