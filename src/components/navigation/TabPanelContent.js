import { Box } from "@mui/material";
import React, { useMemo } from "react";

const TabPanelContent = ({ value, children, tabValue, sx }) => {
  const styles = useMemo(() => {
    return {
      flex: 1,
      ...sx,
    };
  }, [sx]);
  if (value === tabValue) {
    return (
      <Box sx={styles} aria-label="tabs-panel">
        {children}
      </Box>
    );
  }
  return;
};

export default TabPanelContent;
