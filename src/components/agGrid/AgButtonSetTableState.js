import { Button } from "@mui/material";
import { isNil } from "lodash";
import React, { forwardRef, useCallback } from "react";

const AgButtonSetTableState = forwardRef(
  ({ gridState, children, variant = "contained", sx, onClick }, ref) => {
    const handleOnClick = () => {
      if (!ref?.current?.api) {
        console.warn("API not yet ready.");
        return;
      }

      if (onClick) {
        onClick(ref);
      }

      console.log("Applying Grid State:", gridState);

      // Apply column state if available
      if (!isNil(gridState.columnState)) {
        if (ref.current.api.applyColumnState) {
          ref.current.api.applyColumnState({
            state: gridState.columnState,
            applyOrder: true,
          });
        } else if (ref.current.columnApi?.applyColumnState) {
          ref.current.columnApi.applyColumnState({
            state: gridState.columnState,
            applyOrder: true,
          });
        }
      }

      // Apply column group state if available
      if (!isNil(gridState.columnGroupState)) {
        if (ref.current.api.setColumnGroupState) {
          ref.current.api.setColumnGroupState(gridState.columnGroupState);
        } else if (ref.current.columnApi?.setColumnGroupState) {
          ref.current.columnApi.setColumnGroupState(gridState.columnGroupState);
        }
      }

      // Apply filter model if available
      if (!isNil(gridState.filterModel)) {
        if (ref.current.api.setFilterModel) {
          ref.current.api.setFilterModel(gridState.filterModel);
        }
      }

      // Apply sort model if available
      if (!isNil(gridState.sortModel) && gridState.sortModel.length > 0) {
        if (ref.current.api.setSortModel) {
          ref.current.api.setSortModel(gridState.sortModel);
        } else if (ref.current.columnApi?.applyColumnState) {
          // Create a column state with just sort info
          const sortState = gridState.sortModel.map((model) => ({
            colId: model.colId,
            sort: model.sort,
          }));
          ref.current.columnApi.applyColumnState({ state: sortState });
        }
      }

      // Apply row group state if available
      if (
        !isNil(gridState.rowGroupColumns) &&
        gridState.rowGroupColumns.length > 0
      ) {
        if (ref.current.columnApi?.setRowGroupColumns) {
          const rowGroupColumns = gridState.rowGroupColumns.map((col) =>
            typeof col === "string" ? col : col.colId
          );
          ref.current.columnApi.setRowGroupColumns(rowGroupColumns);
        }
      }

      // Apply pivot state if available
      if (!isNil(gridState.pivotColumns) && gridState.pivotColumns.length > 0) {
        if (ref.current.columnApi?.setPivotColumns) {
          const pivotColumns = gridState.pivotColumns.map((col) =>
            typeof col === "string" ? col : col.colId
          );
          ref.current.columnApi.setPivotColumns(pivotColumns);
        }
      }
    };

    return (
      <Button
        sx={sx}
        fullWidth={false}
        variant={variant}
        onClick={handleOnClick}
      >
        {children || "Set State"}
      </Button>
    );
  }
);

export default AgButtonSetTableState;
