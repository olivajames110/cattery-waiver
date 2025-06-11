// src/.../LoanFilesTable/hooks/useHandleDeselectAllRows.js
import { useCallback } from "react";

/**
 * Deselects all rows and clears `selectedRows`.
 * (No longer calls onResetFilesClick, so rowData/chgRows stay intact.)
 */
export const useHandleDeselectAllRows = (setSelectedRows, gridRef) => {
  return useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.deselectAll();
    }
    setSelectedRows([]);
  }, [setSelectedRows, gridRef]);
};
