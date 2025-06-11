import arrayMutators from "final-form-arrays";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-final-form";

import { ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  LinearProgress,
  useMediaQuery,
} from "@mui/material";

import ResilenderLogo from "../../assets/ResilenderLogo";
import AnimatedCheckmark from "../feedback/AnimatedCheckmark/AnimatedCheckMark";
import Flx from "../layout/Flx";
import Htag from "../typography/Htag";
import Txt from "../typography/Txt";
import RffFormSpy from "./shared/RffFormSpy";
import RffGroupContainer from "./shared/RffGroupContainer";
import FormTitleAndDescription from "./ui/FormTitleAndDescription";

const RffFormStepper = ({
  onSubmit,
  children,
  initialValues,
  formSpy,
  loading,
  className,
  success,
  formDescription,
  formTitle,
  successTitle = "Submission Received!",
  successDescription = "Thank you! We've received your submission and will review it shortly.",
  allowStepClickThrough = false,
  initStep = 0,
  finalStepLabel = "Finish",
  sx,
}) => {
  const containerRef = useRef(null);
  const steps = React.Children.toArray(children).filter(Boolean);
  const [step, setStep] = useState(initStep);
  const [values, setValues] = useState(initialValues || {});
  const totalSteps = children.length;
  const isLastStep = step === totalSteps - 1;
  const isMobile = useMediaQuery("(max-width:888px)");
  const [stepErrorMessage, setStepErrorMessage] = useState("");

  // Scroll to top of the scrollable container on step change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const handleNext = (formValues) => {
    setValues(formValues);
    setStepErrorMessage("");
    setStep(Math.min(step + 1, totalSteps - 1));
  };

  const handleBack = () => {
    setStepErrorMessage("");
    setStep(Math.max(step - 1, 0));
  };

  if (success) {
    return (
      <Box
        ref={containerRef}
        sx={{
          overflowY: "auto",
          WebkitOverflowScrolling: "touch", // iOS friendly
          height: "100%",
          width: "100%",
          pt: 4,
          pb: 4,
          pl: 1,
          pr: 1,
          position: "relative",
        }}
      >
        <Container maxWidth="md" sx={{ pt: 6, pb: 6, pl: 2, pr: 2 }}>
          <Flx gap={6} center column>
            <Box sx={{ position: "relative" }}>
              <ResilenderLogo width="105px" />
              <AnimatedCheckmark
                size="36px"
                sx={{
                  position: "absolute",
                  top: "52px",
                  right: "-8px",
                  background: "#ffffff",
                  borderRadius: "50px",
                }}
              />
            </Box>
            <Flx gap={1.5} center column>
              <Htag>{successTitle}</Htag>
              <Txt center>{successDescription}</Txt>
            </Flx>
          </Flx>
        </Container>
      </Box>
    );
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && step !== totalSteps - 1) {
      e.preventDefault();
    }
  };

  return (
    <Form
      onSubmit={onSubmit}
      initialValues={values}
      validate={steps[step].props.validate}
      mutators={{ ...arrayMutators }}
    >
      {({ handleSubmit, form, submitting, pristine, values: formValues }) => {
        const currentStepValidate = steps[step].props.validate;

        const runStepValidation = (valuesForStep) => {
          if (typeof currentStepValidate === "function") {
            return currentStepValidate(valuesForStep) || {};
          }
          return {};
        };

        return (
          <Box
            component="form"
            onSubmit={handleSubmit}
            className={className}
            onKeyDown={handleKeyDown}
            sx={{
              /* Fill entire parent (#root) which is 100% height, no scroll. */
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              width: "100%",
              height: "100%",
              position: "relative",
              // display:'flex',
              zIndex: 1,
              ...sx,
            }}
          >
            <StepperLinearProgress
              sx={{ top: isMobile ? "54px" : 0 }}
              step={step}
              totalSteps={totalSteps}
            />
            {/* <FormStepperProgress
              sx={{ margin: "0 auto", pl: 2 }}
              step={step}
              children={children}
              allowStepClickThrough={allowStepClickThrough}
              onStepClick={async (targetStep) => {
                if (targetStep <= step) {
                  // moving backward or same step
                  setStep(targetStep);
                  return;
                }
                // if skipping forward, validate current step
                const stepErrors = runStepValidation(formValues);
                if (Object.keys(stepErrors).length === 0) {
                  setValues(formValues);
                  setStepErrorMessage("");
                  setStep(targetStep);
                } else {
                  setStepErrorMessage(
                    "Some required fields are missing or invalid"
                  );
                }
              }}
            /> */}
            {/* This is our single scrollable area */}
            <Box
              ref={containerRef}
              sx={{
                overflowY: "auto",
                WebkitOverflowScrolling: "touch", // iOS friendly
                height: "100%",
                width: "100%",

                position: "relative",
                // display: "flex",
              }}
            >
              <Container maxWidth="md">
                <RffGroupContainer isMobile={isMobile}>
                  {step === 0 && (
                    <FormTitleAndDescription
                      title={formTitle}
                      description={formDescription}
                    />
                  )}

                  {/* Render current step content */}
                  {steps[step]}
                  {stepErrorMessage && (
                    <Box mt={2}>
                      <Txt center color="error">
                        {stepErrorMessage}
                      </Txt>
                    </Box>
                  )}
                  {/* Navigation buttons */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mt: 3,
                    }}
                  >
                    {step > 0 && (
                      <Button
                        onClick={handleBack}
                        sx={{ mr: 1 }}
                        size="large"
                        variant="outlined"
                        type="button"
                      >
                        Back
                      </Button>
                    )}

                    {!isLastStep ? (
                      <Button
                        size="large"
                        variant="contained"
                        endIcon={<ChevronRight />}
                        type="button"
                        onClick={() => {
                          // 1) Blur all fields to ensure validation triggers
                          const allFields = form.getRegisteredFields() || [];
                          allFields.forEach((fieldName) => {
                            form.blur(fieldName);
                          });

                          // 2) Check form errors after blur
                          const { errors } = form.getState();
                          if (!errors || Object.keys(errors).length === 0) {
                            setStepErrorMessage("");
                            handleNext(formValues);
                          } else {
                            setStepErrorMessage(
                              "Please correct the errors above before continuing."
                            );
                          }
                        }}
                      >
                        Continue
                      </Button>
                    ) : (
                      <Button
                        loading={loading}
                        size="large"
                        variant="contained"
                        onClick={handleSubmit}
                        // type="submit"
                        disabled={submitting || pristine}
                      >
                        {finalStepLabel}
                      </Button>
                    )}
                  </Box>

                  {/* For debugging or capturing form state */}
                  <RffFormSpy formSpy={formSpy} />
                </RffGroupContainer>
              </Container>
            </Box>
          </Box>
        );
      }}
    </Form>
  );
};

export default RffFormStepper;

/* --------------------------------------- */
/*      Helper Components Below            */
/* --------------------------------------- */

// Simple linear progress bar showing current step
const StepperLinearProgress = ({ step, totalSteps, sx }) => {
  if (step === 0) return null;
  return (
    <LinearProgress
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "6px",
        width: "100%",
        ...sx,
      }}
      variant="determinate"
      value={(step / (totalSteps - 1)) * 100}
    />
  );
};
