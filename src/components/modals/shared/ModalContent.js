import { DialogContent } from "@mui/material";
import React, { useMemo } from "react";

const ModalContent = ({ children, sx }) => {
  const styles = useMemo(() => {
    let sty = { p: 2 };
    return {
      ...sty,
      ...sx,
    };
  }, [sx]);
  return <DialogContent sx={styles}>{children}</DialogContent>;
};

export default ModalContent;
