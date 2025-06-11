import { ModuleRegistry } from "ag-grid-community";
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
import React, { forwardRef, useCallback, useMemo, useState } from "react";

import { blue } from "@mui/material/colors";
import AgGridTableWrapper from "../../../../components/agGrid/AgGridTableWrapper";
import { columnTypesBoolean } from "../../../../utils/agGrid/columnTypes/columnTypesBoolean";
import { columnTypesDate } from "../../../../utils/agGrid/columnTypes/columnTypesDate";
import { columnTypesDollar } from "../../../../utils/agGrid/columnTypes/columnTypesDollar";
import { columnTypesPercent } from "../../../../utils/agGrid/columnTypes/columnTypesPercent";
import { selectOptionsExceptionCategory } from "../../../../constants/selectOptions/selectOptionsExceptionCategory";
import { selectOptionsExceptionReference } from "../../../../constants/selectOptions/selectOptionsExceptionCategory copy";

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

const LoanExceptionsTable = forwardRef(
  ({ rowData, onRowClicked, quickFilterText, selected, gridOptions }, ref) => {
    // Define your columns
    const columnDefs = useMemo(() => {
      return [
        {
          field: "oid",
          headerName: "Oid",
          sortable: true,
          filter: "agTextColumnFilter",
          flex: 1,
          hide: true,
        },
        {
          field: "exceptionCategory",
          headerName: "Exception Category",
          sortable: true,
          filter: "agSetColumnFilter",
          flex: 2,
          filterParams: {
            values: selectOptionsExceptionCategory,
          },
        },
        {
          field: "exceptionReference",
          headerName: "Exception Reference",
          sortable: true,
          filter: "agSetColumnFilter",
          flex: 2,
          filterParams: {
            values: selectOptionsExceptionReference,
          },
        },
        {
          field: "exceptionGuideline",
          headerName: "Exception Guideline",
          // For multiline text, sometimes you'd allow cell wrapping or autoHeight
          sortable: false,
          filter: "agTextColumnFilter",
          flex: 3,
        },
        {
          field: "exceptionApprovalBy",
          headerName: "Exception Approval By",
          sortable: true,
          filter: "agTextColumnFilter",
          flex: 2,
        },
        {
          field: "exceptionApprovalNote",
          headerName: "Exception Approval Note",
          sortable: false,
          filter: "agTextColumnFilter",
          flex: 3,
        },
        {
          field: "exceptionApprovalByCounterparty",
          headerName: "Counterparty Approval?",
          sortable: true,
          filter: "agTextColumnFilter",
          flex: 1,
        },
        {
          field: "counterparty",
          headerName: "Counterparty",
          sortable: true,
          filter: "agTextColumnFilter",
          flex: 2,
        },
        {
          field: "exceptionDate",
          headerName: "Exception Date",
          sortable: true,
          filter: "agDateColumnFilter",
          flex: 2,
        },
        {
          field: "compensatingFactors",
          headerName: "Compensating Factors",
          sortable: false,
          filter: "agTextColumnFilter",
          flex: 3,
        },
        {
          field: "pricingConcession",
          headerName: "Pricing Concession",
          sortable: false,
          filter: "agTextColumnFilter",
          flex: 3,
        },
      ];
    }, []);

    // Default column definition
    const defaultColDef = useMemo(
      () => ({
        filter: true,
        enableRowGroup: true,
        enablePivot: true,
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
        headerCheckboxSelectionFilteredOnly: true,
        menuTabs: ["filterMenuTab"],
      }),
      [,]
    );

    const onGridReady = useCallback((params) => {
      console.log("params.columnApi", params);
      if (params?.api) {
        params?.api?.autoSizeAllColumns();
      }
    }, []);

    const handleOnRowClicked = useCallback(
      (params) => {
        const data = params?.data;
        // setFocusedRowIndex(params.node.rowIndex);
        if (onRowClicked) {
          onRowClicked(data, params);
        }
      },
      [onRowClicked]
    );

    // const onCellFocused = useCallback(
    //   (params) => {
    //     // If params.rowIndex is null, it means focus left the grid
    //     if (params.rowIndex != null) {
    //       setFocusedRowIndex(params.rowIndex);
    //     } else {
    //       setFocusedRowIndex(null);
    //     }
    //   },
    //   [setFocusedRowIndex]
    // );

    // Memoized function to apply a row class based on the focused row index
    const getRowStyle = useCallback(
      (params) => {
        if (params?.data?.oid === selected?.oid) {
          return {
            // background: "#faf0893d",
            background: blue[50],
            borderLeft: `4px solid ${blue[200]}`,
          };
        }
        return {
          // background: "#faf0893d",

          borderLeft: `4px solid transparent`,
        };
      },
      [selected]
    );

    const columnTypes = useMemo(() => {
      return {
        ...columnTypesDate(),
        ...columnTypesPercent(),
        ...columnTypesDollar(),
        ...columnTypesBoolean(),
      };
    }, []);
    return (
      <AgGridTableWrapper
        // fullHeight={!_domLayout}
        // height="100%"
        // suppressBorder
        simpleTable
        // sx={{ borderTop: "1px solid #e0e0e0" }}
        // suppressBorderRadius
        size={4}
      >
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          getRowStyle={getRowStyle}
          rowSelection={"single"}
          columnTypes={columnTypes}
          gridOptions={gridOptions}
          domLayout={"autoHeight"}
          enableCellTextSelection
          onGridReady={onGridReady}
          onRowClicked={handleOnRowClicked}
        />
      </AgGridTableWrapper>
    );
  }
);

export default LoanExceptionsTable;
