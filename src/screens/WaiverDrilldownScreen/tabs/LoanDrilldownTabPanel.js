import React, { useMemo } from "react";
import TabPanel from "../../../components/navigation/TabPanel";

const LoanDrilldownTabPanel = ({ value, tab, children, sx }) => {
  const styles = useMemo(() => {
    return {
      position: "relative",
      flexDirection: "column",
      display: "flex",
      overflow: "hidden",
      ...sx,
    };
  }, [sx]);
  return (
    <TabPanel value={value} tabValue={tab} sx={styles}>
      {children}
    </TabPanel>
  );
};

export default LoanDrilldownTabPanel;
