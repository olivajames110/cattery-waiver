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

const LoanBorrowersTable = forwardRef(
  (
    {
      rowData,
      onRowClicked,
      simpleTable,
      selectedId,
      masterDetail,
      quickFilterText,
    },
    ref
  ) => {
    const columnDefs = useMemo(() => {
      return [
        {
          headerName: "First Name",
          field: "firstName",
          flex: 1,
          minWidth: 200,
          valueFormatter: (params) => {
            return `${params.data?.firstName} ${params.data?.lastName}`;
          },
        },
        {
          headerName: "Last Name",
          field: "lastName",
          hide: true,
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
          headerName: "Estimated FICO",
          // hide: true,
          field: "estimatedFICO",
        },
        {
          headerName: "Has SSN?",
          hide: true,
          field: "borrowerHasSSN",
        },
        {
          headerName: "Borrower SSN",
          hide: true,
          field: "borrowerSSN",
        },
        {
          headerName: "Marital Status",
          hide: true,
          field: "maritalStatus",
        },
        {
          headerName: "Cash Liquidity",
          // hide: true,
          field: "cashLiquidity",
        },
        {
          headerName: "Other Liquidity",
          // hide: true,
          field: "otherLiquidity",
        },

        {
          headerName: "Felony Conviction?",
          hide: true,
          field: "application_felony_conviction",
        },
        {
          headerName: "Financial Fraud Misdemeanor?",
          hide: true,
          field: "application_financial_fraud_misdemeanor",
        },
        {
          headerName: "Bankruptcy?",
          hide: true,
          field: "bankruptcy_flag",
        },
        {
          headerName: "First Time Homebuyer?",
          hide: true,
          field: "firstTimeHomebuyer",
        },
        {
          headerName: "Open Liens/Judgments?",
          hide: true,
          field: "open_liens_judgments",
        },
        {
          headerName: "Tax Liens?",
          hide: true,
          field: "tax_liens",
        },
        {
          headerName: "Charge Offs?",
          hide: true,
          field: "charge_offs",
        },
        {
          headerName: "Financial Judgements?",
          hide: true,
          field: "financial_judgements",
        },
        {
          headerName: "Housing Events?",
          hide: true,
          field: "housing_events",
        },
        {
          headerName: "Forbearance or Modification?",
          hide: true,
          field: "forbearance_or_modification",
        },
        {
          headerName: "Mortgage Lates?",
          hide: true,
          field: "mortgage_lates",
        },
        {
          headerName: "Foreclosure?",
          hide: true,
          field: "foreclosure",
        },
        {
          headerName: "Time Since Housing Event",
          hide: true,
          field: "time_since_housing_event",
        },
        {
          headerName: "Pending Litigation?",
          hide: true,
          field: "pending_litigation",
        },
        {
          headerName: "Has Experience with Income Producing Properties?",
          hide: true,
          field: "hasExperienceWithIncomeProducingProperties",
        },
        {
          headerName: "Has Experience with Fix & Flips?",
          hide: true,
          field: "hasExperienceWithFixFlips",
        },
        {
          headerName: "Has Experience with Ground Up Construction?",
          hide: true,
          field: "hasExperienceWithGroundUpConstruction",
        },
        {
          headerName: "Income Producing Properties (Last 2 Years)",
          hide: true,
          field: "incomeProducingPropertiesWithinTwoYears",
        },
        {
          headerName: "Fix & Flips (Last 2 Years)",
          hide: true,
          field: "fixFlipsWithinTwoYears",
        },
        {
          headerName: "Ground Up Construction Projects (Last 2 Years)",
          hide: true,
          field: "gucProjectsWithinTwoYears",
        },
        {
          headerName: "Borrower Experience Summary",
          hide: true,
          field: "borrowerExperienceSummary",
          // cellStyle or cellRenderer can be used for multi-line text display if needed
        },
      ];
    }, []);

    return (
      <>
        <AgGridClickableTable
          ref={ref}
          rowData={rowData}
          simpleTable={simpleTable}
          columnDefs={columnDefs}
          quickFilterText={quickFilterText}
          selectedId={selectedId}
          path="borrowers"
          // masterDetail={masterDetail}
          onRowClicked={onRowClicked}
        />
        {masterDetail}
      </>
    );
  }
);

export default LoanBorrowersTable;
