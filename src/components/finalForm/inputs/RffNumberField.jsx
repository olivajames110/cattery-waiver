import React, { useMemo } from "react";
import { Field } from "react-final-form";

import TextInput from "../../inputs/TextInput";
import RffInputWrapper from "../shared/RffInputWrapper";

import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";

const RffNumberField = ({
  name,
  label,
  required,
  placeholder = "Enter number",
  suppressGrid,
  disabled,
  onBlur,
  size,
  sx,
}) => {
  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );
  const formatNumber = (value) => {
    if (value === undefined || value === null || value === "") return "";
    return new Intl.NumberFormat().format(value);
  };

  const parseNumber = (value) => {
    if (value === undefined || value === null || value === "") return undefined;
    return Number(value.replace(/,/g, ""));
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
        parse={parseNumber}
        format={formatNumber}
        validate={validate}
        render={({ input, meta }) => (
          <TextInput
            {...input}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            inputMode="numeric" // ✅ Ensures correct keyboard on mobile
            type="tel" // ✅ Works well on iOS
            pattern="[0-9]*" // ✅ Helps enforce numeric input
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffNumberField;
