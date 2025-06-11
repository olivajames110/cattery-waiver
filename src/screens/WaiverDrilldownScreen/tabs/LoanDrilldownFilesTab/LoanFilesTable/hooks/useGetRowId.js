// src/components/LoanFilesTable/hooks/useGetRowId.js
import { useCallback } from "react";

/**
 * Returns a stable function to extract row IDs.
 */
export const useGetRowId = () => {
  return useCallback((params) => {
    return params.data._id;
  }, []);
};
