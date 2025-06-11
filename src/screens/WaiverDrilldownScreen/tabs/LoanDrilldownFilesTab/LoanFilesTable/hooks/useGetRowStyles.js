// src/components/LoanFilesTable/hooks/useGetRowId.js
import { amber, blue, green } from "@mui/material/colors";
import { useCallback } from "react";

/**
 * Returns a stable function to extract row IDs.
 */
export const useGetRowStyles = () => {
  return useCallback((params) => {
    // if (params?.data?._id === activePreviewFile?._id) {
    //   return {
    //     // background: "#faf0893d",
    //     background: blue[50],
    //     borderLeft: `4px solid ${blue[200]}`,
    //   };
    // }
    if (params?.data?.isHidden) {
      return {
        // background: "#faf0893d",
        background: amber[50],
        borderLeft: `4px solid ${amber[200]}`,
      };
    }
    if (params?.data?.isFinal) {
      return {
        borderLeft: `4px solid ${green[500]}`,
        // borderLeft: "4px solid #569a3d",
        background: "#f9fef7",
      };
    }
    return { borderLeft: "3px solid transparent" };
  }, []);
};
