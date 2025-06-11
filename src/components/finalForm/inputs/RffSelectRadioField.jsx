// src/components/rff-fields/RffSelectRadioField.jsx
import React, { useMemo } from "react";
import { Field } from "react-final-form";
import RffInputWrapper from "../shared/RffInputWrapper";
import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import SelectRadioInput from "../../inputs/SelectRadioInput";

const RffSelectRadioField = ({
  name,
  label,
  options,
  required = false,
  disabled = false,
  suppressGrid,
  size = "medium",
  sx,
  helperText,
  row = false,
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
      helperText={helperText}
      required={required}
    >
      <Field
        name={name}
        validate={validate}
        render={({ input, meta }) => (
          <SelectRadioInput
            name={name}
            label={label}
            value={input.value}
            onChange={(v) => input.onChange(v)}
            options={options}
            disabled={disabled}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            row={row}
            sx={sx}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffSelectRadioField;
