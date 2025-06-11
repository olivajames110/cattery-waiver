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
import React, { forwardRef, useMemo } from "react";

import AgGridClickableTable from "../../../../components/agGrid/tables/AgGridClickableTable";

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

const LoanPropertiesTable = forwardRef(
  (
    {
      rowData,
      onRowClicked,
      showAllColumns,
      selectedId,
      quickFilterText,
      height,
      sx,
    },
    ref
  ) => {
    const columnDefs = useMemo(
      () => [
        {
          field: "adddress",
          flex: 1,
          headerName: "Address",
          minWidth: 280,
          valueFormatter: (p) => {
            // console.log(p);
            return p?.data?.address?.fullAddress;
          },
        },
        { field: "propertyType", headerName: "Property Type", minWidth: 220 },
        {
          field: "asIsValue",
          headerName: "As-Is Value",
          type: "dollar",
        },
        {
          field: "arv",
          headerName: "ARV",
          type: "dollar",
        },
        {
          field: "residentialSqFootage",
          headerName: "Residential Sq Ft",
        },
        {
          hide: !showAllColumns,
          field: "purchasePrice",
          headerName: "Purchase Price",
          type: "dollar",
        },
        {
          hide: !showAllColumns,
          field: "purchaseDate",
          headerName: "Purchase Date",
          type: "date",
          // params.value ? new Date(params.value).toLocaleDateString() : "",
        },
        {
          hide: !showAllColumns,
          field: "assignmentFees",
          headerName: "Assignment Fees",
          type: "dollar",
        },
        {
          hide: !showAllColumns,
          field: "sellersConcession",
          headerName: "Seller's Concession",
        },
        {
          hide: !showAllColumns,
          field: "floodZone",
          headerName: "Flood Zone",
        },

        {
          hide: !showAllColumns,
          field: "afterRenoSqFootage",
          headerName: "After Reno Sq Ft",
        },
        {
          hide: !showAllColumns,
          field: "annualTaxes",
          headerName: "Annual Taxes",
          type: "dollar",
        },
        {
          hide: !showAllColumns,
          field: "annualInsurance",
          headerName: "Annual Insurance",
          type: "dollar",
        },
        {
          hide: !showAllColumns,
          field: "annualFloodInsurance",
          headerName: "Annual Flood Insurance",
          type: "dollar",
        },
        {
          hide: !showAllColumns,
          field: "annualHoaFees",
          headerName: "Annual HOA Fees",
          type: "dollar",
        },
        {
          hide: !showAllColumns,
          field: "annualOtherExpense",
          headerName: "Annual Other Expense",
          type: "dollar",
        },
        {
          hide: !showAllColumns,
          field: "propertyConditionAtOrigination",
          headerName: "Property Condition",
        },
        {
          hide: !showAllColumns,
          field: "ffPropertyStatus",
          headerName: "FF Property Status",
        },
        {
          hide: !showAllColumns,
          field: "gucPropertyStatus",
          headerName: "GUC Property Status",
        },
        {
          hide: !showAllColumns,
          field: "constructionBudget",
          headerName: "Construction Budget",
          type: "dollar",
        },
        {
          hide: !showAllColumns,
          field: "financedBudgetPercent",
          headerName: "Financed Budget %",
        },
      ],
      [showAllColumns]
    );

    return (
      <AgGridClickableTable
        ref={ref}
        sx={sx}
        height={height}
        rowData={rowData}
        columnDefs={columnDefs}
        selectedId={selectedId}
        path="properties"
        quickFilterText={quickFilterText}
        onRowClicked={onRowClicked}
      />
    );
  }
);

export default LoanPropertiesTable;
