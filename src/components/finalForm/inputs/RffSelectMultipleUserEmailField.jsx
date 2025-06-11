import React, { useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";

import { useSelector } from "react-redux";
import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";
import SelectMultipleInput from "../../inputs/SelectMultipleInput";

const RffSelectMultipleUserEmailField = ({
  name,
  label,
  displayFullLabel = false,
  required,
  disabled,
  suppressGrid,
  size,
  sx,
}) => {
  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );
  const users = useSelector((state) => state?.users);
  const selectOptionsUserEmailOptions = useMemo(
    () =>
      (users || [])
        .map((user) => ({
          label: displayFullLabel
            ? `${user?.fullName} <${user?.emailAddress}>`
            : user?.fullName,
          optionLabel: `${user?.fullName} <${user?.emailAddress}>`,
          value: user?.emailAddress,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
    [users, displayFullLabel]
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
          <SelectMultipleInput
            label={label}
            disabled={disabled}
            value={input?.value}
            options={selectOptionsUserEmailOptions}
            onChange={(v) => {
              input.onChange(v);
            }}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffSelectMultipleUserEmailField;
