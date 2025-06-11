import React, { useCallback, memo } from "react";
import { Box, Button, Container, Typography } from "@mui/material";
import arrayMutators from "final-form-arrays";
import { Form } from "react-final-form";
import { isNil } from "lodash";

import Flx from "../layout/Flx";
import RffFormSpy from "./shared/RffFormSpy";
import FormTitleAndDescription from "./ui/FormTitleAndDescription";
import RffGroupContainer from "./shared/RffGroupContainer";
import RffGroup from "./shared/RffGroup";

/**
 * If your RffTextField or other child components are
 * properly subscribing only to the fields they need,
 * then the main form wrapper doesn't need to subscribe
 * to the entire form state.
 */
function RffForm({
  formSpy,
  id,
  onSubmit,
  children,
  initialValues,
  errorMessage,
  isLoading,
  onCancel,
  loading,
  titleSize = "md",
  maxWidth = false,
  formTitle,
  formDescription,
  className,
  suppressFooter,
  includeBottomSpacing,
  titleContent,
  flexDirection = "column",
  titleEndContent,
  footerStartContent,
  grid,
  startContent,
  gap = "44px",
  submitText = "Submit",
  sx,
  validate,
}) {
  // Wrap onSubmit in useCallback for stable references:
  const handleOnSubmit = useCallback(
    (formData) => {
      if (onSubmit) {
        onSubmit(formData);
      }
    },
    [onSubmit]
  );

  return (
    <Form
      // Subscribe to validation errors
      subscription={{
        submitting: true,
        hasValidationErrors: true,
        errors: true,
        //
        // values: true,
        // active: true,
        // modified: true,
      }}
      initialValues={initialValues}
      onSubmit={handleOnSubmit}
      mutators={{ ...arrayMutators }}
      validate={validate}
      // Instead of inline render function, pass to a memoized component:
      render={(formRenderProps) => (
        <RffFormInner
          id={id}
          className={className}
          gap={gap}
          formRenderProps={formRenderProps}
          children={children}
          errorMessage={errorMessage}
          isLoading={isLoading}
          onCancel={onCancel}
          loading={loading}
          formTitle={formTitle}
          titleContent={titleContent}
          titleSize={titleSize}
          titleEndContent={titleEndContent}
          maxWidth={maxWidth}
          formDescription={formDescription}
          suppressFooter={suppressFooter}
          grid={grid}
          includeBottomSpacing={includeBottomSpacing}
          flexDirection={flexDirection}
          startContent={startContent}
          footerStartContent={footerStartContent}
          submitText={submitText}
          sx={sx}
          formSpy={formSpy}
        />
      )}
    />
  );
}

/**
 * 2) A separate memoized component that receives the formRenderProps.
 * This way, if the parent re-renders but the props and form state haven't changed,
 * this won't re-render unnecessarily.
 */
const RffFormInner = memo(function RffFormInner({
  id,
  formRenderProps,
  children,
  errorMessage,
  onCancel,
  loading,
  suppressFooter,
  startContent,
  maxWidth,
  submitText,
  sx,
  className,
  flexDirection,
  includeBottomSpacing,
  grid,
  footerStartContent,
  formSpy,
}) {
  const { handleSubmit, submitting, hasValidationErrors, errors } =
    formRenderProps;

  // Create a combined validation error message
  const validationErrorMessage =
    hasValidationErrors && errors
      ? Object.values(errors)
          .filter((error) => typeof error === "string")
          .join(", ")
      : null;

  return (
    <Box
      component="form"
      id={id}
      className={`rff-form-root ${className}`}
      onSubmit={handleSubmit}
      sx={{
        width: "inherit",
        display: "flex",
        flexDirection: "column",
        // gap: "36px",
        ...sx,
      }}
    >
      {startContent}
      <Container
        sx={{
          p: "0 !important",
          //
        }}
        maxWidth={maxWidth}
      >
        {grid ? (
          <RffGroup rowSpacing={2.5}>{children}</RffGroup>
        ) : (
          <RffGroupContainer
            flexDirection={flexDirection}
            suppressFooter={suppressFooter}
          >
            {children}
          </RffGroupContainer>
        )}

        <RffFormFooter
          suppressFooter={suppressFooter}
          onCancel={onCancel}
          loading={loading}
          submitText={submitText}
          footerStartContent={footerStartContent}
          validationErrorMessage={validationErrorMessage}
        />
        {/* Only render the spy if needed */}
        <RffFormSpy formSpy={formSpy} />
        <ErrorMessage error={errorMessage}>{errorMessage}</ErrorMessage>
      </Container>
    </Box>
  );
});

/**
 * The footer can also be memoized if props don't change often
 * (some will skip this if they frequently show `pristine` or `submitting`).
 */
const RffFormFooter = memo(function RffFormFooter({
  onCancel,
  disabled,
  loading,
  submitText = "Submit",
  suppressFooter,
  footerStartContent,
  validationErrorMessage,
}) {
  if (suppressFooter) return null;

  return (
    <Flx
      direction="column"
      sx={{
        mt: 1,
        width: "100%",
      }}
    >
      {/* Show validation error message if exists */}
      {/* {validationErrorMessage && (
        <Typography
          color="error"
          sx={{
            mb: 2,
            width: "100%",
            textAlign: "left",
          }}
        >
          {validationErrorMessage}
        </Typography>
      )} */}

      <Flx
        fw
        end
        sx={{
          width: "100%",
        }}
      >
        {footerStartContent}
        <Flx>
          {onCancel ? (
            <Button
              variant="outlined"
              color="primary"
              onClick={onCancel}
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
          ) : null}
          <Button
            // If you have a custom loading button, pass `loading`
            disabled={disabled}
            variant="contained"
            color="primary"
            size="large"
            type="submit"
            loading={loading}
          >
            {submitText}
          </Button>
        </Flx>
      </Flx>
    </Flx>
  );
});

const ErrorMessage = memo(function ErrorMessage({ error, children }) {
  if (isNil(error)) {
    return null;
  }
  return <Typography color="error">{children}</Typography>;
});

export default memo(RffForm);
