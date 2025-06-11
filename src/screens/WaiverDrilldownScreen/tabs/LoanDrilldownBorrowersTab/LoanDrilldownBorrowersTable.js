import React, { forwardRef, useMemo, useCallback, useState } from "react";
import { AgGridReact } from "ag-grid-react";
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

import {
  fileDocGroups,
  getDocTypesByGroup,
} from "../../../../config/fileDocGroupAndTypes";
import { sideBarColumnsFilters } from "../../../../utils/agGrid/sideBar/sideBarColumnsFilters";

import AgGridTableWrapper from "../../../../components/agGrid/AgGridTableWrapper";
import { amber, blue, green, orange, yellow } from "@mui/material/colors";
import { columnTypesDate } from "../../../../utils/agGrid/columnTypes/columnTypesDate";
import { columnTypesPercent } from "../../../../utils/agGrid/columnTypes/columnTypesPercent";
import { columnTypesDollar } from "../../../../utils/agGrid/columnTypes/columnTypesDollar";
import { columnTypesBoolean } from "../../../../utils/agGrid/columnTypes/columnTypesBoolean";

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

const LoanDrilldownBorrowersTable = forwardRef(
  ({ rowData, onRowClicked, quickFilterText, selected, gridOptions }, ref) => {
    const [focusedRowIndex, setFocusedRowIndex] = useState(null);

    // Define your columns
    const columnDefs = useMemo(() => {
      return [
        {
          headerName: "First Name",
          field: "firstName",
        },
        {
          headerName: "Last Name",
          field: "lastName",
        },
        {
          headerName: "Phone",
          field: "phone",
        },
        {
          headerName: "Email Address",
          field: "emailAddress",
        },
        {
          headerName: "Citizenship Status",
          field: "citizenshipStatus",
        },
        {
          headerName: "Primary Address",
          field: "primaryAddress.fullAddress", // Access nested property
        },
        {
          headerName: "DOB",
          field: "dateOfBirth",
          type: "date",
        },
        {
          headerName: "Has SSN?",
          field: "borrowerHasSSN",
        },
        {
          headerName: "Borrower SSN",
          field: "borrowerSSN",
        },
        {
          headerName: "Marital Status",
          field: "maritalStatus",
        },
        {
          headerName: "Cash Liquidity",
          field: "cashLiquidity",
        },
        {
          headerName: "Other Liquidity",
          field: "otherLiquidity",
        },
        {
          headerName: "Estimated FICO",
          field: "estimatedFICO",
        },
        {
          headerName: "Felony Conviction?",
          field: "application_felony_conviction",
        },
        {
          headerName: "Financial Fraud Misdemeanor?",
          field: "application_financial_fraud_misdemeanor",
        },
        {
          headerName: "Bankruptcy?",
          field: "bankruptcy_flag",
        },
        {
          headerName: "First Time Homebuyer?",
          field: "firstTimeHomebuyer",
        },
        {
          headerName: "Open Liens/Judgments?",
          field: "open_liens_judgments",
        },
        {
          headerName: "Tax Liens?",
          field: "tax_liens",
        },
        {
          headerName: "Charge Offs?",
          field: "charge_offs",
        },
        {
          headerName: "Financial Judgements?",
          field: "financial_judgements",
        },
        {
          headerName: "Housing Events?",
          field: "housing_events",
        },
        {
          headerName: "Forbearance or Modification?",
          field: "forbearance_or_modification",
        },
        {
          headerName: "Mortgage Lates?",
          field: "mortgage_lates",
        },
        {
          headerName: "Foreclosure?",
          field: "foreclosure",
        },
        {
          headerName: "Time Since Housing Event",
          field: "time_since_housing_event",
        },
        {
          headerName: "Pending Litigation?",
          field: "pending_litigation",
        },
        {
          headerName: "Has Experience with Income Producing Properties?",
          field: "hasExperienceWithIncomeProducingProperties",
        },
        {
          headerName: "Has Experience with Fix & Flips?",
          field: "hasExperienceWithFixFlips",
        },
        {
          headerName: "Has Experience with Ground Up Construction?",
          field: "hasExperienceWithGroundUpConstruction",
        },
        {
          headerName: "Income Producing Properties (Last 2 Years)",
          field: "incomeProducingPropertiesWithinTwoYears",
        },
        {
          headerName: "Fix & Flips (Last 2 Years)",
          field: "fixFlipsWithinTwoYears",
        },
        {
          headerName: "Ground Up Construction Projects (Last 2 Years)",
          field: "gucProjectsWithinTwoYears",
        },
        {
          headerName: "Borrower Experience Summary",
          field: "borrowerExperienceSummary",
          // cellStyle or cellRenderer can be used for multi-line text display if needed
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
        setFocusedRowIndex(params.node.rowIndex);
        if (onRowClicked) {
          onRowClicked(data, params);
        }
      },
      [onRowClicked, setFocusedRowIndex]
    );

    const onCellFocused = useCallback(
      (params) => {
        // If params.rowIndex is null, it means focus left the grid
        if (params.rowIndex != null) {
          setFocusedRowIndex(params.rowIndex);
        } else {
          setFocusedRowIndex(null);
        }
      },
      [setFocusedRowIndex]
    );

    // Memoized function to apply a row class based on the focused row index
    const getRowStyle = useCallback(
      (params) => {
        if (params?.data?._id === selected?._id) {
          return {
            // background: "#faf0893d",
            background: blue[50],
            borderLeft: `4px solid ${blue[200]}`,
          };
        }
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
        height="100%"
        suppressBorder
        suppressBorderRadius
        size={4}
      >
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          getRowStyle={getRowStyle}
          stopEditingWhenCellsLoseFocus
          rowSelection={"single"}
          sideBar={{
            hiddenByDefault: true,
            defaultToolPanel: "", // Don't open any specific panel by default
            toolPanels: [
              {
                id: "columns",
                labelKey: "columns",
                labelDefault: "Columns",
                iconKey: "columns",
                toolPanel: "agColumnsToolPanel",
              },
              {
                id: "filters",
                labelKey: "filters",
                labelDefault: "Filters",
                iconKey: "filter",
                toolPanel: "agFiltersToolPanel",
              },
            ],
          }}
          tooltipShowDelay={0}
          tooltipInteraction={true}
          tooltipMouseTrack
          columnTypes={columnTypes}
          onCellFocused={onCellFocused}
          allowDragFromColumnsToolPanel={false}
          gridOptions={gridOptions}
          domLayout={"autoHeight"}
          rowGroupPanelShow={"always"}
          enableCellTextSelection
          onGridReady={onGridReady}
          onRowClicked={handleOnRowClicked}
        />
      </AgGridTableWrapper>
    );
  }
);

export default LoanDrilldownBorrowersTable;
