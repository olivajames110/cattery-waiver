import { DialogContent } from "@mui/material";
import React, { useMemo } from "react";

const AdaptiveModelContent = ({ children, sx }) => {
  const styles = useMemo(() => {
    let sty = { padding: "10px 12px" };
    return {
      ...sty,
      ...sx,
    };
  }, [sx]);
  return <DialogContent sx={styles}>{children}</DialogContent>;
};

export default AdaptiveModelContent;
