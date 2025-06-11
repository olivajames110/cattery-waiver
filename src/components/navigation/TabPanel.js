import { Box } from "@mui/material";
import React, { useMemo } from "react";
import ScreenContent from "../layout/ScreenContent";

const TabPanel = ({
  value,
  children,
  padding,
  returnChild,
  tabValue,
  forceDisplay,
  sx,
}) => {
  const styles = useMemo(() => {
    return {
      flex: 1,
      ...sx,
    };
  }, [sx]);

  if (forceDisplay) {
    if (forceDisplay === tabValue) {
      return children;
    }
  }
  if (value === tabValue) {
    if (returnChild) {
      return children;
    }
    return (
      <ScreenContent
        sx={styles}
        aria-label="tabs-panel"
        padding={padding ? 2 : 0}
      >
        {children}
      </ScreenContent>
    );
  }
  return null;
};

export default TabPanel;
