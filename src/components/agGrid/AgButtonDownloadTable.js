import DownloadRounded from "@mui/icons-material/DownloadRounded";
import { IconButton, Tooltip } from "@mui/material";
import { ExcelExportModule, ModuleRegistry } from "ag-grid-enterprise";
import { format } from "date-fns";
import React, { forwardRef } from "react";

ModuleRegistry.registerModules([ExcelExportModule]);
const AgButtonDownloadTable = forwardRef(
  (
    { downloadName = "table_data.xlsx", excludeDownloadNameDate, tooltip },
    gridRef
  ) => {
    const handleClick = () => {
      const shorthandDate = format(new Date(), "M-d-yy");
      const file_name = excludeDownloadNameDate
        ? downloadName
        : `${downloadName} - ${shorthandDate}`;
      if (gridRef.current) {
        gridRef.current?.api?.exportDataAsExcel({
          allColumns: true,
          fileName: file_name,
          sheetName: "AG Grid Data",
        });
      }
    };

    if (tooltip) {
      return (
        <Tooltip title={tooltip} arrow>
          <IconButton onClick={handleClick}>
            <DownloadRounded />
          </IconButton>
        </Tooltip>
      );
    }

    return (
      <IconButton onClick={handleClick}>
        <DownloadRounded />
      </IconButton>
    );
  }
);

export default AgButtonDownloadTable;
