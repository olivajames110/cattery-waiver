import React, { useMemo } from "react";
import { Field } from "react-final-form";
import { differenceInYears } from "date-fns";

import RffInputWrapper from "../shared/RffInputWrapper";
import DateInput from "../../inputs/DateInput";
import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";

const RffDateAdultField = ({
  name,
  label,
  required,
  disabled,
  suppressGrid,
  size,
  sx,
}) => {
  const validate = useMemo(() => {
    return (value) => {
      // 1. required check
      if (required) {
        const msg = VALIDATOR_REQUIRE(value);
        if (msg) return msg;
      }

      // 2. only if a value was entered, enforce 18+ years
      if (value) {
        // DateInput will typically give you either a Date object or an ISO string
        const selected = typeof value === "string" ? new Date(value) : value;
        const age = differenceInYears(new Date(), selected);
        if (age < 18) {
          return "You must be at least 18 years old";
        }
      }
    };
  }, [required]);

  return (
    <RffInputWrapper
      label={label}
      suppressGrid={suppressGrid}
      size={size}
      required={required}
      sx={sx}
    >
      <Field
        name={name}
        validate={validate}
        render={({ input, meta }) => (
          <DateInput
            {...input}
            disabled={disabled}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            // optional: you can also prevent the user from picking a too‐recent date
            // maxDate={subYears(new Date(), 18)}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffDateAdultField;
