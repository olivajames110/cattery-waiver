import React, { useMemo } from "react";
import { Field } from "react-final-form";

import TextInput from "../../inputs/TextInput";
import RffInputWrapper from "../shared/RffInputWrapper";

import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import { isString } from "lodash";

const RffPhoneField = ({
  name,
  label,
  required,
  suppressGrid,
  disabled,
  size,
  onBlur,
  sx,
  placeholder = "Enter valid phone number",
}) => {
  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );

  const formatPhone = (value) => {
    if (!value || !isString(value)) return "";
    // Remove all non-digits
    const digits = value.replace(/[^\d]/g, "");

    // Format as (XXX) XXX-XXXX if more than 6 digits
    if (digits.length > 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(
        6,
        10
      )}`;
    }
    // Format as (XXX) XXX if between 4 and 6 digits
    if (digits.length > 3) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    }
    return digits;
  };

  const parsePhone = (value) => {
    // Always keep the raw digits in form state
    return value ? value.replace(/[^\d]/g, "") : "";
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
        parse={parsePhone}
        format={formatPhone}
        // formatOnBlur
        validate={validate}
        render={({ input, meta }) => (
          <TextInput
            {...input}
            // onBlur={onBlur}
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

export default RffPhoneField;
