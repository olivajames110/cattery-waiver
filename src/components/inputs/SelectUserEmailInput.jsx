import { useMemo } from "react";
import { useSelector } from "react-redux";
import SelectAutoInput from "./SelectAutoInput";

const SelectUserEmailInput = ({
  value,
  onChange,
  fullWidth = true,
  sx,
  options,
  size = "medium",
  placeholder,
  label,
  displayFullLabel = false,
  error,
  helperText,
}) => {
  // Find the "selected" option object whose .value matches `value`.
  const users = useSelector((state) => state?.users);
  const selectOptionsUserEmailOptions = useMemo(
    () =>
      (users || [])
        .map((user) => ({
          // label: user?.fullName,
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
    <SelectAutoInput
      label={label}
      value={value}
      options={selectOptionsUserEmailOptions}
      onChange={onChange}
      error={error}
      helperText={helperText}
    />
  );
};

export default SelectUserEmailInput;
