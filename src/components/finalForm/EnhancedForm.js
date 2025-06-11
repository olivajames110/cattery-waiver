import React, { useCallback, useMemo, memo, useRef } from "react";
import { Form } from "react-final-form";
import arrayMutators from "final-form-arrays";
import { Box, Button, Typography, Container } from "@mui/material";
import { isNil, isEqual } from "lodash";

// Simple flexible container component
const Flex = memo(
  ({
    children,
    direction = "row",
    justify = "flex-start",
    align = "stretch",
    sx = {},
    ...props
  }) => (
    <Box
      sx={{
        display: "flex",
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        ...sx,
      }}
      {...props}
    >
      {children}
    </Box>
  )
);

// Error message component
const ErrorMessage = memo(({ error }) => {
  if (isNil(error)) return null;

  return (
    <Typography color="error" sx={{ mt: 1, mb: 2 }}>
      {error}
    </Typography>
  );
});

// Form footer component
const FormFooter = memo(
  ({
    onCancel,
    disabled,
    loading,
    submitText = "Submit",
    suppressFooter,
    validationErrorMessage,
    footerStartContent,
  }) => {
    if (suppressFooter) return null;

    return (
      <Flex direction="column" sx={{ mt: 2, width: "100%" }}>
        {validationErrorMessage && (
          <Typography color="error" sx={{ mb: 2, width: "100%" }}>
            {validationErrorMessage}
          </Typography>
        )}

        <Flex justify="space-between" sx={{ width: "100%" }}>
          {footerStartContent}
          <Flex>
            {onCancel && (
              <Button
                variant="outlined"
                color="primary"
                onClick={onCancel}
                sx={{ mr: 1 }}
              >
                Cancel
              </Button>
            )}
            <Button
              disabled={disabled || loading}
              variant="contained"
              color="primary"
              type="submit"
            >
              {loading ? "Loading..." : submitText}
            </Button>
          </Flex>
        </Flex>
      </Flex>
    );
  }
);

/**
 * Enhanced form component with on-blur and debounced field change detection
 * Works with all field types including select fields, toggles, checkboxes, etc.
 */
const EnhancedForm = ({
  // Form behavior props
  initialValues,
  onSubmit,
  validate,
  onFieldChange,

  // UI props
  children,
  className,
  sx = {},
  flexDirection = "column",
  maxWidth = false,

  // Form state related
  errorMessage,
  loading = false,

  // UI customization
  formTitle,
  formDescription,
  submitText = "Submit",
  suppressFooter = false,
  onCancel,
  footerStartContent,
  id,

  // New options
  debounceTime = 500, // Default debounce time in ms
  triggerOnChange = false, // Only trigger on blur by default
}) => {
  // Create refs to hold pending updates and timers
  const pendingUpdatesRef = useRef({});
  const timersRef = useRef({});

  // Wrap callbacks in useCallback for stability
  const handleSubmit = useCallback(
    (formData) => {
      if (onSubmit) {
        onSubmit(formData);
      }
    },
    [onSubmit]
  );

  // Get validation error message
  const getValidationErrorMessage = useCallback((errors) => {
    if (!errors) return null;
    return Object.values(errors)
      .filter((error) => typeof error === "string")
      .join(", ");
  }, []);

  // Handle field change with debouncing and blur detection
  const handleFieldChange = useCallback(
    (field, value, form) => {
      if (!onFieldChange) return;

      // Store the current value for this field
      const prevValue = initialValues?.[field];

      // Skip if values are the same
      if (isEqual(prevValue, value)) return;

      // Store this update in our pending updates
      pendingUpdatesRef.current[field] = {
        field,
        oldValue: prevValue,
        newValue: value,
      };

      // Clear any existing timer for this field
      if (timersRef.current[field]) {
        clearTimeout(timersRef.current[field]);
      }

      // Set a new timer for this field if we're debouncing on change
      if (triggerOnChange) {
        timersRef.current[field] = setTimeout(() => {
          const update = pendingUpdatesRef.current[field];
          if (update) {
            onFieldChange(update);
            delete pendingUpdatesRef.current[field];
          }
        }, debounceTime);
      }
    },
    [onFieldChange, initialValues, debounceTime, triggerOnChange]
  );

  // Handle field blur to commit changes immediately
  const handleFieldBlur = useCallback(
    (field) => {
      if (!onFieldChange) return;

      // Clear any pending timer for this field
      if (timersRef.current[field]) {
        clearTimeout(timersRef.current[field]);
        delete timersRef.current[field];
      }

      // Apply the pending update for this field if it exists
      const update = pendingUpdatesRef.current[field];
      if (update) {
        onFieldChange(update);
        delete pendingUpdatesRef.current[field];
      }
    },
    [onFieldChange]
  );

  // Function to process children recursively (defined outside the render function)
  const processChildren = useCallback(
    (children) => {
      return React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;

        // Pass special props to Field components
        if (child.type && child.type.name === "Field") {
          return React.cloneElement(child, {
            onChange: (value) => {
              // Call the original onChange if it exists
              if (child.props.onChange) {
                child.props.onChange(value);
              }

              // Track the change
              handleFieldChange(child.props.name, value);
            },
            onBlur: () => {
              // Call the original onBlur if it exists
              if (child.props.onBlur) {
                child.props.onBlur();
              }

              // Process on blur
              handleFieldBlur(child.props.name);
            },
          });
        }

        // Recursively process children
        if (child.props && child.props.children) {
          return React.cloneElement(child, {
            ...child.props,
            children: processChildren(child.props.children),
          });
        }

        return child;
      });
    },
    [handleFieldChange, handleFieldBlur]
  );

  return (
    <Form
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validate={validate}
      mutators={{ ...arrayMutators }}
      subscription={{
        submitting: true,
        hasValidationErrors: true,
        errors: true,
      }}
      render={({ handleSubmit, errors, hasValidationErrors }) => {
        const validationErrorMessage = hasValidationErrors
          ? getValidationErrorMessage(errors)
          : null;

        // If we have onFieldChange, modify the children to add change tracking
        const childrenWithTracking = onFieldChange
          ? processChildren(children)
          : children;

        return (
          <Box
            component="form"
            id={id}
            className={`enhanced-form ${className || ""}`}
            onSubmit={handleSubmit}
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              ...sx,
            }}
          >
            <Container maxWidth={maxWidth} sx={{ p: 0 }}>
              {/* Form title and description if provided */}
              {(formTitle || formDescription) && (
                <Box sx={{ mb: 3 }}>
                  {formTitle && (
                    <Typography variant="h5" component="h2">
                      {formTitle}
                    </Typography>
                  )}
                  {formDescription && (
                    <Typography variant="body2" color="textSecondary">
                      {formDescription}
                    </Typography>
                  )}
                </Box>
              )}

              {/* Form content with tracking added */}
              <Flex direction={flexDirection} sx={{ width: "100%" }}>
                {childrenWithTracking}
              </Flex>

              {/* Form footer */}
              <FormFooter
                suppressFooter={suppressFooter}
                onCancel={onCancel}
                loading={loading}
                submitText={submitText}
                footerStartContent={footerStartContent}
                validationErrorMessage={validationErrorMessage}
              />

              {/* Form error message */}
              <ErrorMessage error={errorMessage} />
            </Container>
          </Box>
        );
      }}
    />
  );
};

export default memo(EnhancedForm);
