import arrayMutators from "final-form-arrays";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-final-form";

import { ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  LinearProgress,
  MobileStepper,
  Step,
  StepButton,
  StepLabel,
  Stepper,
  useMediaQuery,
} from "@mui/material";
import { grey } from "@mui/material/colors";

import ResilenderLogo from "../../assets/ResilenderLogo";
import AnimatedCheckmark from "../feedback/AnimatedCheckmark/AnimatedCheckMark";
import Flx from "../layout/Flx";
import Htag from "../typography/Htag";
import Txt from "../typography/Txt";
import RffFormSpy from "./shared/RffFormSpy";
import { camelCaseToSentence } from "../../utils/strings/camelCaseToSentence";

const RffFullPageFormStepper = ({
  onSubmit,
  children,
  initialValues,
  formSpy,
  loading,
  className,
  success,
  formDescription,
  formTitle,
  defaultStep = 0,
  successTitle = "Submission Received!",
  successDescription = "Thank you! We've received your submission and will review it shortly.",
  allowStepClickThrough = false,
  finalStepLabel = "Finish",
  sx,
}) => {
  const containerRef = useRef(null);
  const steps = React.Children.toArray(children).filter(Boolean);
  const [step, setStep] = useState(defaultStep || 0);
  const [values, setValues] = useState(initialValues || {});
  const totalSteps = children.length;
  const isLastStep = step === totalSteps - 1;
  const isMobile = useMediaQuery("(max-width:888px)");

  // NEW: track which fields failed validation
  const [stepErrorMessage, setStepErrorMessage] = useState("");
  const [stepErrorFields, setStepErrorFields] = useState([]);

  // Scroll to top of the scrollable container on step change
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [step]);

  const handleNext = (formValues) => {
    setValues(formValues);
    // clear any prior errors
    setStepErrorMessage("");
    setStepErrorFields([]);
    setStep(Math.min(step + 1, totalSteps - 1));
  };

  const handleBack = () => {
    // clear any prior errors
    setStepErrorMessage("");
    setStepErrorFields([]);
    setStep(Math.max(step - 1, 0));
  };

  if (success) {
    return (
      <Box
        ref={containerRef}
        sx={{
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
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
        const runStepValidation = (vals) =>
          (typeof currentStepValidate === "function" &&
            currentStepValidate(vals)) ||
          {};

        return (
          <Box
            component="form"
            onSubmit={handleSubmit}
            className={className}
            onKeyDown={handleKeyDown}
            sx={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              width: "100%",
              height: "100%",
              position: "relative",
              zIndex: 1,
              ...sx,
            }}
          >
            <FullPageFormStepperLayout
              isMobile={isMobile}
              sidebarWidth={275}
              mobileHeaderHeight="54px"
              mobileNavEndContent={
                <FormStepperProgress step={step} isMobile children={children} />
              }
              sidebar={
                <Box
                  sx={{
                    background: grey[100],
                    borderRight: `1px solid ${grey[300]}`,
                    height: "100%",
                    p: 2,
                  }}
                >
                  <Flx center sx={{ p: 3, pb: 4 }}>
                    <ResilenderLogo />
                  </Flx>
                  <FormStepperProgress
                    sx={{ margin: "0 auto", pl: 2 }}
                    step={step}
                    children={children}
                    allowStepClickThrough={allowStepClickThrough}
                    onStepClick={async (targetStep) => {
                      if (targetStep <= step) {
                        setStepErrorMessage("");
                        setStepErrorFields([]);
                        setStep(targetStep);
                        return;
                      }
                      const stepErrors = runStepValidation(formValues);
                      if (Object.keys(stepErrors).length === 0) {
                        handleNext(formValues);
                      } else {
                        setStepErrorMessage(
                          "Some required fields are missing or invalid"
                        );
                        setStepErrorFields(Object.keys(stepErrors));
                      }
                    }}
                  />
                </Box>
              }
            >
              <Box
                ref={containerRef}
                sx={{
                  overflowY: "auto",
                  WebkitOverflowScrolling: "touch",
                  height: "100%",
                  width: "100%",
                  position: "relative",
                }}
              >
                <StepperLinearProgress
                  sx={{ top: isMobile ? "54px" : 0 }}
                  step={step}
                  totalSteps={totalSteps}
                />
                <Container maxWidth="md">
                  <Flx
                    column
                    fw
                    sx={{
                      p: 2,
                      pt: isMobile ? 12 : 8,
                      pb: 12,
                      ".rff-group": {
                        mb: 8,
                      },
                    }}
                  >
                    {step === 0 && (
                      <FormTitleAndDescription
                        title={formTitle}
                        description={formDescription}
                      />
                    )}

                    {steps[step]}

                    {/* NEW: render both message and list of invalid fields */}
                    {stepErrorFields.length > 0 && (
                      <Box mt={2}>
                        <Txt center color="error">
                          {stepErrorMessage}
                        </Txt>
                        <Flx
                          column
                          sx={{
                            textAlign: "left",
                            pl: 4,
                            mt: 1,
                            color: "error.main",
                          }}
                        >
                          {stepErrorFields.map((field) => (
                            <li key={field}>
                              <Txt>{camelCaseToSentence(field)}</Txt>
                            </li>
                          ))}
                        </Flx>
                      </Box>
                    )}

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
                            // blur to trigger validation
                            form
                              .getRegisteredFields()
                              .forEach((name) => form.blur(name));

                            const { errors } = form.getState();
                            if (!errors || Object.keys(errors).length === 0) {
                              handleNext(formValues);
                            } else {
                              setStepErrorMessage(
                                "Please correct the errors above before continuing."
                              );
                              setStepErrorFields(Object.keys(errors));
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
                          disabled={submitting || pristine}
                        >
                          {finalStepLabel}
                        </Button>
                      )}
                    </Box>

                    <RffFormSpy formSpy={formSpy} />
                  </Flx>
                </Container>
              </Box>
            </FullPageFormStepperLayout>
          </Box>
        );
      }}
    </Form>
  );
};

export default RffFullPageFormStepper;

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

// Title + Description at the top of the form
const FormTitleAndDescription = ({ title, description }) => {
  if (!title && !description) return null;

  return (
    <>
      <Flx column gap={1} sx={{ mt: 2, mb: 10 }}>
        {title && (
          <Htag
            h1
            sx={{
              fontFamily: "var(--inter)",
              fontSize: "36px",
              lineHeight: "54px",
            }}
          >
            {title}
          </Htag>
        )}
        {description && <Txt fontSize="18px">{description}</Txt>}
      </Flx>
      <Divider sx={{ mb: 6 }} />
    </>
  );
};

/** Stepper with clickable steps (desktop) or a MobileStepper for small screens. */
const FormStepperProgress = ({
  step,
  children,
  sx,
  onStepClick,
  allowStepClickThrough,
  isMobile,
}) => {
  if (isMobile) {
    return (
      <MobileStepper
        variant="dots"
        steps={children.length}
        position="static"
        activeStep={step}
        sx={{
          "&.MuiPaper-root": {
            p: 0,
            background: "none",
          },
          ...sx,
        }}
      />
    );
  }

  return (
    <Stepper orientation="vertical" activeStep={step} sx={sx} nonLinear>
      {children.map((child, index) => (
        <Step key={index}>
          {allowStepClickThrough ? (
            <StepButton onClick={() => onStepClick && onStepClick(index)}>
              {child.props.stepName}
            </StepButton>
          ) : (
            <StepLabel> {child.props.stepName}</StepLabel>
          )}
        </Step>
      ))}
    </Stepper>
  );
};

/**
 * Layout for the form:
 * - Desktop uses a persistent Drawer on the left for the sidebar
 * - Mobile uses a simple top bar with the “dots” stepper
 */
const FullPageFormStepperLayout = ({
  isMobile,
  sidebarWidth = 320,
  mobileHeaderHeight = "54px",
  mobileNavEndContent,
  sidebar,
  children,
}) => {
  if (isMobile) {
    return (
      <>
        {/* Mobile top bar */}
        <MobileNavbar
          mobileHeaderHeight={mobileHeaderHeight}
          mobileNavEndContent={mobileNavEndContent}
        />
        {/* The main content (children) below the top bar */}
        <Box sx={{ flexGrow: 1, display: "flex", width: "100%" }}>
          {children}
        </Box>
      </>
    );
  }

  // Desktop layout: left sidebar as a Drawer, main content on the right
  return (
    <>
      <DesktopNavbar drawerWidth={sidebarWidth}>{sidebar}</DesktopNavbar>
      <Box sx={{ flexGrow: 1, display: "flex", width: "100%" }}>{children}</Box>
    </>
  );
};

const MobileNavbar = ({ mobileNavEndContent, mobileHeaderHeight }) => {
  return (
    <Flx
      fw
      g={2}
      ac
      jb
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        height: mobileHeaderHeight,
        background: "#ffffff",
        pl: 2,
        pr: 3,
        flexShrink: 0,
        flexGrow: 0,
        zIndex: 222,
        width: "100%",
        boxShadow:
          "rgba(0, 0, 0, 0.32) 0px 0px 1px, rgba(0, 0, 0, 0.08) 0px 0px 2px, rgba(0, 0, 0, 0.08) 0px 1px 3px",
      }}
    >
      <ResilenderLogo width="36px" />
      {mobileNavEndContent}
    </Flx>
  );
};

const DesktopNavbar = ({ children, drawerWidth = 210, open = true }) => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        background: "red",
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          position: "absolute",
          boxSizing: "border-box",
        },
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      {children}
    </Drawer>
  );
};
