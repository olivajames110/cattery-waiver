import React, { useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";

import DateInput from "../../inputs/DateInput";
import { VALIDATOR_REQUIRE } from "../validators/VALIDATOR_REQUIRE";
import DateTimeInput from "../../inputs/DateTimeInput";

const RffDateTimeField = ({
  name,
  label,
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
          <DateTimeInput
            {...input}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffDateTimeField;
