import { Button } from "@mui/material";
import React, { forwardRef } from "react";
import { agGridResetTableState } from "../../utils/agGrid/agGridResetTableState";
import { isFunction } from "lodash";

const AgButtonResetState = forwardRef(
  ({ onClick, startIcon, endIcon, variant, children }, ref) => {
    const handleOnClick = () => {
      if (isFunction(onClick)) {
        onClick(ref);
      }
      agGridResetTableState(ref);
    };
    return (
      <Button
        fullWidth={false}
        startIcon={startIcon}
        endIcon={endIcon}
        variant={variant}
        onClick={handleOnClick}
      >
        {children ? children : "Reset"}
      </Button>
    );
  }
);

export default AgButtonResetState;
