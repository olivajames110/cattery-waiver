import { Checkbox, CircularProgress, FormControlLabel } from "@mui/material";
import React, { useCallback, useMemo } from "react";

const CheckboxInput = ({
  checked,
  defaultChecked,
  loading,
  label,
  sx,
  size = "small",
  grow,
  shrink,
  labelSx,
  labelFontSize = "13px",
  onChange,
}) => {
  const styles = useMemo(() => {
    return {
      flexGrow: grow ? 1 : 0,
      flexShrink: shrink ? 1 : 0,
      span: {
        fontSize: labelFontSize,
        ...labelSx,
      },
      ...sx,
    };
  }, [sx, labelSx, labelFontSize, shrink, grow]);

  const onCheckboxChange = useCallback(
    (e) => {
      const value = e.target.checked;
      if (onChange) {
        onChange(value);
      }
    },
    [onChange]
  );
  return (
    <FormControlLabel
      label={label}
      sx={styles}
      control={
        loading ? (
          <CircularProgress size={13} sx={{ mr: 1 }} />
        ) : (
          <Checkbox
            loading
            defaultChecked={defaultChecked}
            checked={checked}
            size={size}
            onChange={onCheckboxChange}
          />
        )
      }
    />
  );
};

export default CheckboxInput;
