import React, { useState, useMemo, useCallback } from "react";
import { Field } from "react-final-form";
import { IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import TextInput from "../../inputs/TextInput";
import RffInputWrapper from "../shared/RffInputWrapper";
import { VALIDATOR_REQUIRE } from "../../../utils/finalForm/validators/VALIDATOR_REQUIRE";

const RffSsnField = ({
  name,
  label,
  required,
  suppressGrid,
  onBlur,
  disabled,
  size,
  sx,
}) => {
  const [showSsn, setShowSsn] = useState(false);

  // Optional validation
  const validate = useMemo(
    () => (required ? VALIDATOR_REQUIRE : undefined),
    [required]
  );

  // Restrict the raw digits in state to max 9
  const parseSsn = useCallback((value) => {
    if (!value) return "";
    const digits = value.replace(/[^\d]/g, "");
    return digits.slice(0, 9);
  }, []);

  // Format differently depending on showSsn
  const formatSsn = useCallback(
    (value) => {
      if (!value) return "";
      const digits = value.replace(/[^\d]/g, "");

      if (showSsn) {
        // Show dashes only if showSsn is true
        if (digits.length <= 3) return digits;
        if (digits.length <= 5) {
          return digits.slice(0, 3) + "-" + digits.slice(3);
        }
        return (
          digits.slice(0, 3) + "-" + digits.slice(3, 5) + "-" + digits.slice(5)
        );
      } else {
        // If hidden, remove dashes so password field is only as long as the digits
        return digits;
      }
    },
    [showSsn]
  );

  return (
    <RffInputWrapper
      label={label}
      suppressGrid={suppressGrid}
      size={size}
      sx={sx}
    >
      <Field
        name={name}
        parse={parseSsn}
        format={formatSsn}
        validate={validate}
        render={({ input, meta }) => (
          <TextInput
            {...input}
            type={showSsn ? "text" : "password"}
            onBlur={onBlur}
            disabled={disabled}
            error={meta.touched && !!meta.error}
            helperText={meta.touched && meta.error}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowSsn((prev) => !prev)}>
                    {showSsn ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffSsnField;
