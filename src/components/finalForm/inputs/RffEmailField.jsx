import React, { useMemo } from "react";
import { Field } from "react-final-form";

import TextInput from "../../inputs/TextInput";
import RffInputWrapper from "../shared/RffInputWrapper";

import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import { VALIDATOR_EMAIL } from "../../../utils/finalForm/validators/VALIDATOR_EMAIL";
import { composeValidators } from "../../../utils/finalForm/validators/composeValidators";

const RffEmailField = ({
  name,
  label,
  required,
  placeholder = "Enter valid email address",
  suppressGrid,
  disabled,
  onBlur,
  size,
}) => {
  const validate = useMemo(() => {
    if (required) {
      return composeValidators(VALIDATOR_REQUIRE, VALIDATOR_EMAIL);
    }
    // If not required, only check email format
    return VALIDATOR_EMAIL;
  }, [required]);

  const formatEmail = (value) => {
    if (!value) return "";
    // Example: trim whitespace & force lowercase
    return value.trim().toLowerCase();
  };

  const parseEmail = (value) => {
    // Same logic so the stored form value remains trimmed & lowercased
    return value ? value.trim().toLowerCase() : "";
  };

  return (
    <RffInputWrapper
      label={label}
      suppressGrid={suppressGrid}
      size={size}
      required={required}
    >
      <Field
        name={name}
        parse={parseEmail}
        format={formatEmail}
        validate={validate}
        render={({ input, meta }) => (
          <TextInput
            {...input}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffEmailField;
