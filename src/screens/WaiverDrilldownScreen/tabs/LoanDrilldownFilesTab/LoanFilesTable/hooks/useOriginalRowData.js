// src/components/LoanFilesTable/hooks/useOriginalRowData.js
import { useMemo } from "react";

/**
 * Keeps a stable copy of `files` for diffing.
 */
export const useOriginalRowData = (files) => {
  return useMemo(() => files, [files]);
};
