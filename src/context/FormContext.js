import React, { createContext, useContext } from "react";

// Create context for form-related data
const FormContext = createContext({
  fieldTypes: {},
  registerFieldType: () => {},
});

/**
 * FormProvider component to provide field type registration functionality
 * for determining which fields should be updated immediately vs. debounced
 */
export const FormProvider = ({ children }) => {
  // Keep track of field types
  const [fieldTypes, setFieldTypes] = React.useState({});

  // Register a field type
  const registerFieldType = (fieldName, type) => {
    setFieldTypes((prev) => ({
      ...prev,
      [fieldName]: type,
    }));
  };

  const value = {
    fieldTypes,
    registerFieldType,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
};

// Hook for components to access the form context
export const useFormContext = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};

// Field type constants for easier reference
export const FIELD_TYPES = {
  TEXT: "text",
  SELECT: "select",
  BOOLEAN: "boolean",
  BOOLEAN_TOGGLE: "booleanToggle",
  BOOLEAN_CHECKBOX: "booleanCheckbox",
  DATE: "date",
  DOLLAR: "dollar",
  PERCENT: "percent",
  NUMBER: "number",
  EMAIL: "email",
  PHONE: "phone",
};

export default FormContext;
