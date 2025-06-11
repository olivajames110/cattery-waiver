import React from "react";

import { add, isNil } from "lodash";
import RffBooleanCheckbox from "../inputs/RffBooleanCheckbox";
import RffBooleanToggleField from "../inputs/RffBooleanToggleField";
import RffDateField from "../inputs/RffDateField";
import RffDollarField from "../inputs/RffDollarField";
import RffEmailField from "../inputs/RffEmailField";
import RffNumberField from "../inputs/RffNumberField";
import RffPercentField from "../inputs/RffPercentField";
import RffPhoneField from "../inputs/RffPhoneField";

import RffSelectField from "../inputs/RffSelectField";
import RffSelectToggleField from "../inputs/RffSelectToggleField";
import RffSsnField from "../inputs/RffSsnField";
import RffTextareaField from "../inputs/RffTextareaField";
import RffTextField from "../inputs/RffTextField";
import RffDisplayField from "../inputs/RffDisplayField";
import RffSelectMultipleField from "../inputs/RffSelectMultipleField";
import RffSelectAutocompleteField from "../inputs/RffSelectAutocompleteField";
import RffSelectUserEmailField from "../inputs/RffSelectUserEmailField";
import RffSelectMultipleUserEmailField from "../inputs/RffSelectMultipleUserEmailField";
import RffAddressGeolocateField from "../inputs/RffAddressGeolocateField";
import RffFloatField from "../inputs/RffFloatField";

const RffFieldComponentRenderer = ({ field }) => {
  if (isNil(field?.field) || field?.field === " " || field?.field === "") {
    return null;
  }
  const componentKey = field.inputType || field.type;

  const componentMap = {
    default: RffTextField,
    text: RffTextField,
    dollar: RffDollarField,
    percent: RffPercentField,
    phone: RffPhoneField,
    email: RffEmailField,
    ssn: RffSsnField,
    booleanCheckbox: RffBooleanCheckbox,
    booleanToggle: RffBooleanToggleField,
    select: RffSelectField,
    selectToggle: RffSelectToggleField,
    selectMultiple: RffSelectMultipleField,
    selectMultipleUserEmail: RffSelectMultipleUserEmailField,
    selectAutocomplete: RffSelectAutocompleteField,
    selectUserEmail: RffSelectUserEmailField,
    number: RffNumberField,
    integer: RffNumberField,
    float: RffFloatField,
    // float: RffNumberField,
    date: RffDateField,
    stringMultiline: RffTextareaField,
    address: RffAddressGeolocateField,
    string: RffTextField,
    display: RffDisplayField,
  };

  const Component = componentMap[componentKey] || componentMap.default;

  return (
    <Component
      key={field.id}
      name={field.field}
      label={field.label}
      size={field.size || 12}
      required={field.required}
      validate={field.validate} // Ensure validation is passed down
      helperText={field.helperText}
      options={field.choices || field.options}
      elements={field?.elements}
      field={field}
      suppressGrid={field?.suppressGrid}
      fullWidth={field?.fullWidth}
      placeholder={field?.placeholder}
      disabled={field?.disabled}
      onBlur={field?.onBlur}
      toggleSize={field.toggleSize}
      parameters={field.parameters}
    />
  );
};

export default RffFieldComponentRenderer;

// selectMultiple: RffSelectMultipleField,
// selectAutocomplete: RffSelectAutocompleteField,
// selectAutocomplete: RffSelectAutocompleteField,
