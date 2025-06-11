import { ModuleRegistry, themeQuartz } from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MultiFilterModule,
  PivotModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  SetFilterModule,
  SideBarModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import React, { forwardRef, useCallback, useMemo } from "react";

import { amber, green } from "@mui/material/colors";
import AgGridTableWrapper from "../AgGridTableWrapper";
import AgGridTableRoot from "../AgGridTableRoot";

ModuleRegistry.registerModules([
  SideBarModule,
  RowGroupingPanelModule,
  MultiFilterModule,
  RowGroupingModule,
  PivotModule,
  TreeDataModule,
  FiltersToolPanelModule,
  ColumnsToolPanelModule,
  SetFilterModule,
]);

const myTheme = themeQuartz.withParams({
  // borderColor: "#9696C8",
  wrapperBorder: false,
  headerRowBorder: false,
  // rowBorder: { style: "dotted", width: 3 },
  rowBorder: { style: "dotted", color: "#ddddddd1", width: 1 },
  // rowBorder: "none",
  cellTextColor: "#33475b",
  fontSize: "12px",
  columnBorder: "none",
  // columnBorder: { style: "dashed" },
});
const AgGridBasicDisplayTable = forwardRef(
  (
    {
      rowData,
      columnDefs,
      editing,
      onCellChanged,
      quickFilterText,
      showHiddenFiles,
      height = "100%",
      gridOptions,
      noBorder,
      showLeftBorder,
      showRightBorder,
      showTopBorder,
      showBottomBorder,
      noBorderRadius,
      noMinHeight,
    },
    ref
  ) => {
    // Define your columns

    // Default column definition

    // Row style highlighting logic

    // We override the default autoGroupColumnDef so that the grouping
    // display column is docGroup, not file_display_name:

    // Single-click expand/collapse on group rows
    const onRowClicked = useCallback((params) => {
      if (params.node.group) {
        params.node.setExpanded(!params.node.expanded);
      }
    }, []);

    // const onGridReady = useCallback((params) => {
    //   console.log("params.columnApi", params);
    //   if (params?.api) {
    //     params?.api?.autoSizeAllColumns();
    //   }
    // }, []);

    return (
      <AgGridTableRoot
        height={height}
        suppressBorder
        suppressBorderRadius
        noBorder={noBorder}
        showLeftBorder={showLeftBorder}
        showRightBorder={showRightBorder}
        showTopBorder={showTopBorder}
        showBottomBorder={showBottomBorder}
        noBorderRadius={noBorderRadius}
        size={4}
      >
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={columnDefs}
          quickFilterText={quickFilterText}
          // getRowStyle={getRowStyle}

          // domLayout={"autoHeight"}
          headerHeight={0}
          theme={myTheme}
          gridOptions={gridOptions}
          enableCellTextSelection
          // onGridReady={onGridReady}
          onRowClicked={onRowClicked}
        />
      </AgGridTableRoot>
    );
  }
);

export default AgGridBasicDisplayTable;
