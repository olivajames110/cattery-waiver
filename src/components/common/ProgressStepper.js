import { Box, Step, StepButton, Stepper, styled } from "@mui/material";
import { blue, blueGrey, grey } from "@mui/material/colors";
import React from "react";

const CustomStep = styled(Step)(({ theme, ownerState }) => ({
  "& .MuiStepLabel-root": {
    padding: "8px 16px",
    paddingLeft: "16px",
    zIndex: 111,
    whiteSpace: "nowrap",
    paddingRight: 0,
  },
  ".MuiStepLabel-label": {
    color: blueGrey[500],

    "&.Mui-completed": {
      color: blue[900],
      fontWeight: 400,
    },
    "&.Mui-active": {
      fontWeight: 800,
      color: blue[900],
    },
  },
  "& .MuiStepLabel-iconContainer": {
    display: "none", // Hide the default icon
  },
  "& .MuiStepLabel-labelContainer": {
    color: ownerState.active
      ? "white"
      : ownerState.completed
        ? "white"
        : "#757575",
    fontWeight: 500,
  },
  backgroundColor: ownerState.active
    ? blue[100]
    : ownerState.completed
      ? blue[50]
      : "#ffffff",
  borderRadius: 0,
  // Special styling for first and last steps
  "&:first-of-type": {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  "&:last-of-type": {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  // Custom connector styling
  "&:not(:last-child)::after": {
    content: '""',
    position: "absolute",
    width: 25,
    height: 25,
    borderRadius: "3px",
    backgroundColor: "inherit",
    right: "-11px",
    top: "50%",
    transform: "translateY(-50%) rotate(45deg)",
    zIndex: 1,
  },
}));

// Custom StepConnector
const CustomStepper = styled(Stepper)({
  background: "transparent",
  border: `1px solid ${blueGrey[50]}`,
  // border: `1px solid ${blueGrey[50]}`,
  // overflowX: "auto",
  // overflowY: "hidden",
  overflow: "hidden",
  zIndex: 100,
  borderRadius: "8px",
  "& .MuiStepConnector-root": {
    display: "none", // Hide default connectors
  },
  "& .MuiStep-root": {
    padding: 0,
    position: "relative",
    flex: 1,
  },
});
const ProgressStepper = ({ activeStep, setActiveStep, statusList }) => {
  return (
    <Box
      sx={{
        width: "100%",
        //
        // mb: 4,
      }}
    >
      <CustomStepper nonLinear activeStep={activeStep}>
        {statusList.map((label, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;
          const color = isActive || isCompleted ? blue[800] : blue[50];
          return (
            <CustomStep
              key={label}
              completed={index < activeStep}
              active={index === activeStep}
              ownerState={{
                completed: index < activeStep,
                active: index === activeStep,
              }}
            >
              <StepButton sx={{ fontSize: "12px", cursor: "text" }}>
                {label}
              </StepButton>
            </CustomStep>
          );
        })}
      </CustomStepper>
    </Box>
  );
};

export default ProgressStepper;
