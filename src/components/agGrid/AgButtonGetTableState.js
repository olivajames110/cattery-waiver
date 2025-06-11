import { Button } from "@mui/material";
import { isFunction } from "lodash";
import React, { forwardRef } from "react";

const AgButtonGetTableState = forwardRef(
  ({ variant = "contained", onClick, startIcon, endIcon, children }, ref) => {
    const handleOnClick = () => {
      if (!ref?.current?.api) {
        console.warn("API not yet ready.");
        return;
      }

      // Safely check and get states
      const columnState = ref.current.api.getColumnState
        ? ref.current.api.getColumnState()
        : ref.current.columnApi?.getColumnState();

      const columnGroupState = ref.current.api.getColumnGroupState
        ? ref.current.api.getColumnGroupState()
        : ref.current.columnApi?.getColumnGroupState();

      // For filter model, use the right API method
      const filterModel = ref.current.api.getFilterModel
        ? ref.current.api.getFilterModel()
        : {};

      // For sort model, check both APIs
      let sortModel = [];
      if (ref.current.api.getSortModel) {
        sortModel = ref.current.api.getSortModel();
      } else if (ref.current.columnApi?.getColumnState) {
        // Extract sort info from column state as fallback
        sortModel = columnState
          .filter((col) => col.sort)
          .map((col) => ({
            colId: col.colId,
            sort: col.sort,
          }));
      }

      // Get row group columns if available
      let rowGroupColumns = [];
      if (ref.current.columnApi?.getRowGroupColumns) {
        rowGroupColumns = ref.current.columnApi.getRowGroupColumns();
      }

      // Get pivot columns if available
      let pivotColumns = [];
      if (ref.current.columnApi?.getPivotColumns) {
        pivotColumns = ref.current.columnApi.getPivotColumns();
      }

      // Create a comprehensive state object
      const gridState = {
        columnState,
        columnGroupState,
        filterModel,
        sortModel,
        rowGroupColumns,
        pivotColumns,
      };

      console.log("Saved Grid State:", gridState);

      if (isFunction(onClick)) {
        onClick(gridState, gridState);
      }
    };

    return (
      <Button
        size="small"
        fullWidth={false}
        startIcon={startIcon}
        endIcon={endIcon}
        variant={variant}
        onClick={handleOnClick}
      >
        {children || "Get State"}
      </Button>
    );
  }
);

export default AgButtonGetTableState;
