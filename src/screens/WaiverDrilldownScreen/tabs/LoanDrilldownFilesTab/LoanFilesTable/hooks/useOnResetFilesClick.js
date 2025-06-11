// src/components/LoanFilesTable/hooks/useOnResetFilesClick.js
import { useCallback } from "react";

/**
 * Resets everything:
 *   - rowData ← originalRowData
 *   - clears selection
 *   - clears changedRows
 *
 * Expects:
 *   • originalRowData (array)
 *   • setChangedRows (state setter)
 *   • setRowData (state setter)
 *   • gridRef (ref to AgGridReact)
 */
export const useOnResetFilesClick = (
  originalRowData,
  setChangedRows,
  setRowData,
  gridRef
) => {
  return useCallback(() => {
    // Copy “originalRowData” back into rowData
    setRowData(originalRowData.map((r) => ({ ...r })));

    // Deselect all rows in the grid UI
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.deselectAll();
    }

    // Clear any accumulated changedRows
    setChangedRows([]);
  }, [originalRowData, setChangedRows, setRowData, gridRef]);
};
