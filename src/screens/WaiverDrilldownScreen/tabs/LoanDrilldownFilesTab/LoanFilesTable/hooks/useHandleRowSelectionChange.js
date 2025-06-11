// src/components/LoanFilesTable/hooks/useHandleRowSelectionChange.js
import { useCallback } from "react";

/**
 * A callback that fires when row selection changes.
 *   - calls `setSelectedRows` with the newly selected rows.
 */
export const useHandleRowSelectionChange = (setSelectedRows) => {
  return useCallback(
    (params) => {
      const selected = params.api.getSelectedRows();
      setSelectedRows(selected);
    },
    [setSelectedRows]
  );
};
