import React, { useCallback, useRef } from "react";
import { Form } from "react-final-form";
import { debounce } from "lodash";

// This is an internal component that uses hooks properly
const FormRenderer = ({
  handleSubmit,
  form,
  pristine,
  submitting,
  values,
  dirty,
  dirtyFields,
  dirtySinceLastSubmit,
  children,
  className,
  sx,
  formSpy,
  debouncedSubmit,
}) => {
  // Use refs to prevent infinite loops with form state objects
  const prevValuesRef = useRef(values);
  const formStateRef = useRef({
    form,
    values,
    pristine,
    submitting,
    dirty,
    dirtyFields,
    dirtySinceLastSubmit,
  });

  // Update form state ref without causing re-renders
  formStateRef.current = {
    form,
    values,
    pristine,
    submitting,
    dirty,
    dirtyFields,
    dirtySinceLastSubmit,
  };

  // Call formSpy when needed, but avoid dependency on objects
  React.useEffect(() => {
    if (
      formSpy &&
      (prevValuesRef.current !== values || !prevValuesRef.current)
    ) {
      formSpy(formStateRef.current);
      prevValuesRef.current = values;
    }
  }, [formSpy, values]);

  // Auto-save when values change
  React.useEffect(() => {
    if (!pristine && !submitting) {
      debouncedSubmit(values, form);
    }
  }, [debouncedSubmit, form, pristine, submitting, values]);

  return (
    <form onSubmit={handleSubmit} className={className} style={sx}>
      {typeof children === "function"
        ? children(formStateRef.current)
        : children}
    </form>
  );
};

const AutosaveFinalForm = ({
  onSubmit = () => {},
  initialValues = {},
  children,
  debounceTime = 1000,
  formSpy,
  className,
  sx = {},
}) => {
  // Create a debounced submit function
  const debouncedSubmit = useCallback(
    debounce((values, form) => {
      onSubmit(values, form);
    }, debounceTime),
    [onSubmit, debounceTime]
  );

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={initialValues}
      subscription={{
        pristine: true,
        submitting: true,
        values: true,
        dirty: true,
        dirtySinceLastSubmit: true,
        dirtyFields: true,
      }}
      render={(formProps) => (
        <FormRenderer
          {...formProps}
          children={children}
          className={className}
          sx={sx}
          formSpy={formSpy}
          debouncedSubmit={debouncedSubmit}
        />
      )}
    />
  );
};

export default AutosaveFinalForm;
