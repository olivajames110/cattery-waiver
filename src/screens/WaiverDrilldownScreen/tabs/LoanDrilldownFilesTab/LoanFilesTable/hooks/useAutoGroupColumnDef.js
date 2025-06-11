// src/components/LoanFilesTable/hooks/useAutoGroupColumnDef.js
import { useMemo } from "react";

/**
 * Wraps the imported autoGroupColumnDef in a useMemo so it’s stable.
 */
export const useAutoGroupColumnDef = () => {
  return useMemo(
    () => ({
      field: "docGroup",
      headerName: "Document Group",
      minWidth: 220,
      cellRendererParams: {
        suppressCount: true,
      },
      cellStyle: { fontWeight: "bold" },
      comparator: (valueA, valueB) => {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
        return 0;
      },
    }),
    []
  );
};
