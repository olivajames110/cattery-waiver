import React, { useMemo } from "react";
import { Field } from "react-final-form";

import PercentInput from "../../inputs/PercentInput";
import RffInputWrapper from "../shared/RffInputWrapper";

import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";

const RffPercentField = ({
  name,
  label,
  disabled,
  required,
  suppressGrid,
  onBlur,
  size,
  fullWidth,
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
          <PercentInput
            {...input}
            onBlur={onBlur}
            disabled={disabled}
            fullWidth={fullWidth}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffPercentField;
