import { Box, FormHelperText, Grid, InputLabel } from "@mui/material";
import { isNil } from "lodash";
import React, { useMemo } from "react";
import Flx from "../../layout/Flx";
import InputWrapper from "../../inputs/shared/InputWrapper";

const RffInputWrapper = ({
  label,
  children,
  suppressGrid,
  sx = {},
  size = 12,
  testing,
  fullWidth = true,
  helperText,
  required,
}) => {
  const gridSizeProps = useMemo(() => {
    return {
      xs: 12,
      sm: 12,
      md: size,
      lg: size,
      xl: size,
    };
  }, [size]);
  if (suppressGrid) {
    return (
      <RenderedContent
        sx={sx}
        helperText={helperText}
        label={label}
        testing={testing}
        fullWidth={fullWidth}
        required={required}
      >
        {children}
      </RenderedContent>
    );
  }

  return (
    <Grid item {...gridSizeProps} sx={sx}>
      <RenderedContent
        helperText={helperText}
        label={label}
        testing={testing}
        fullWidth={fullWidth}
        required={required}
      >
        {children}
      </RenderedContent>
    </Grid>
  );
};

const RenderedContent = ({
  label,
  helperText,
  sx,
  children,
  required,
  fullWidth,
  testing,
}) => {
  const styles = useMemo(() => {
    let initStyles = {
      flexShrink: 0,
    };

    return {
      ...initStyles,

      ...sx,
    };
  }, [sx, testing]);

  if (isNil(label)) {
    return children;
  }
  return (
    <InputWrapper
      fullWidth={fullWidth}
      sx={styles}
      helperText={helperText}
      label={label}
      required={required}
    >
      {children}
    </InputWrapper>
  );
};

export default RffInputWrapper;
