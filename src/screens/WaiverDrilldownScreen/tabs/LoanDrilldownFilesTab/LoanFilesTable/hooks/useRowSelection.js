// src/components/LoanFilesTable/hooks/useRowSelection.js
import { useMemo } from "react";

/**
 * Configures rowSelection based on whether editing is enabled.
 */
export const useRowSelection = (editing) => {
  return useMemo(() => {
    if (editing) {
      return { mode: "multiRow" };
    }
    return {};
  }, [editing]);
};
