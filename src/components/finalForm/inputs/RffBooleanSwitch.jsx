import React, { useMemo } from "react";
import { Field } from "react-final-form";

import RffInputWrapper from "../shared/RffInputWrapper";

import { Switch, FormControlLabel } from "@mui/material";
import { isBoolean } from "lodash";
import { VALIDATOR_REQUIRE } from "../validators/VALIDATOR_REQUIRE";

const RffBooleanSwitch = ({ name, label, required, suppressGrid, size, switchSize = "small", sx }) => {
  const validate = useMemo(() => (required ? VALIDATOR_REQUIRE : undefined), [required]);

  return (
    <RffInputWrapper suppressGrid={suppressGrid} size={size}>
      <Field
        name={name}
        validate={validate}
        render={({ input, meta }) => (
          <Switch
            defaultChecked={!isBoolean(input.value) ? false : input.value}
            size={switchSize}
            {...input}
            onChange={(event) => {
              input.onChange(event.target.checked);
            }}
            sx={sx}
          />
          // <FormControlLabel
          //   control={
          //     <Switch
          //       defaultChecked={!isBoolean(input.value) ? false : input.value}
          //       size={switchSize}
          //       {...input}
          //       onChange={(event) => {
          //         input.onChange(event.target.checked);
          //       }}
          //       sx={sx}
          //     />
          //   }
          //   label={label}
          // />
        )}
      />
    </RffInputWrapper>
  );
};

export default RffBooleanSwitch;
