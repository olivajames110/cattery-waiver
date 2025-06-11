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

const LoanAppraisalsTable = forwardRef(
  ({ rowData, onRowClicked, quickFilterText, selected, gridOptions }, ref) => {
    // Define your columns
    const columnDefs = useMemo(() => {
      return [
        {
          headerName: "OID",
          field: "oid",
          filter: true,
        },
        {
          headerName: "Deal ID",
          field: "dealId",
          filter: true,
        },
        {
          headerName: "Subject Property ID",
          field: "subjectPropertyId",
          filter: true,
        },
        {
          headerName: "Order Date",
          field: "orderDate",
          type: "date",
          description: "Date appraisal was ordered",
        },
        {
          headerName: "Schedule Date",
          field: "scheduleDate",
          type: "date",
          description: "Date appraisal is scheduled to be conducted",
        },
        {
          headerName: "Report Received Date",
          field: "reportReceivedDate",
          type: "date",
          description: "Date the report was received",
        },
        {
          headerName: "Appraisal Type",
          field: "appraisalType",
          filter: true,
          description: "Form 1004, etc.",
        },
        {
          headerName: "Appraisal Requirements",
          field: "appraisalRequirements",
          description: "List of requirements for the appraisal",
        },
        {
          headerName: "Appraisal Owner Point of Contact",
          field: "appraisalOwnerPointOfContact",
          description: "Details about the point of contact for the appraisal",
        },
        {
          headerName: "Appraisal Management Company",
          field: "appraisalManagementCompany",
        },
        {
          headerName: "Appraisal Through Lender",
          field: "appraisalThroughLender",
          type: "boolean",
          description: "Appraisal ordered through another lender",
        },
        {
          headerName: "Appraisal Stage",
          field: "appraisalStage",
          filter: true,
          description: "Stage of the appraisal process",
        },
        {
          headerName: "Appraisal Is Commercial",
          field: "appraisalIsCommerical",
          type: "boolean",
        },
        {
          headerName: "Appraiser",
          field: "appraiser",
          description: "Contact info for the appraiser",
        },
        {
          headerName: "Appraiser License Number",
          field: "appraiserLicenseNumber",
          description: "Appraiser license number",
        },
        {
          headerName: "Appraiser License Expiration Date",
          field: "appraiserLicenseExpirationDate",
          type: "date",
        },
        {
          headerName: "Appraisal Document ID",
          field: "appraisalDocumentId",
        },
        {
          headerName: "Appraisal Includes Scope of Work",
          field: "appraisalIncludesScopeOfWork",
          type: "boolean",
        },
        {
          headerName: "Appraisal As-Is Value",
          field: "appraisalAsIsValue",
          type: "dollar",
        },
        {
          headerName: "Appraisal ARV",
          field: "appraisalARV",
          type: "dollar",
        },
        {
          headerName: "Appraisal Includes Market Rents",
          field: "appraisalIncludesMarketRents",
          type: "boolean",
        },
        {
          headerName: "Appraisal Subject To",
          field: "appraisalSubjectTo",
          type: "boolean",
        },
        {
          headerName: "Appraisal Valuation Date",
          field: "appraisalValuationDate",
          type: "date",
        },
        {
          headerName: "Appraisal Recertified Date",
          field: "appraisalRecertifiedDate",
          type: "date",
        },
        {
          headerName: "Ordered By",
          field: "orderedBy",
          description: "Email of the individual ordering appraisal",
        },
        {
          headerName: "Appraisal Review Notes",
          field: "appraisalReviewNotes",
        },
        {
          headerName: "Appraisal Review Date",
          field: "appraisalReviewDate",
          type: "date",
        },
        {
          headerName: "Appraisal Reviewed",
          field: "appraisalReviewed",
          type: "boolean",
        },
        {
          headerName: "Appraisal Reviewed By",
          field: "appraisalReviewedBy",
        },
        {
          headerName: "Appraisal Cost",
          field: "appraisalCost",
          type: "dollar",
        },
        {
          headerName: "Appraisal Paid For",
          field: "appraisalPaidFor",
          type: "boolean",
        },
        {
          headerName: "Appraisal Paid Method",
          field: "appraisalPaidMethod",
          filter: true,
          valueSet: ["Borrower Paid", "Lender Paid"],
        },
      ];
    }, []);

    return (
      <AgGridClickableTable
        ref={ref}
        rowData={rowData}
        columnDefs={columnDefs}
        quickFilterText={quickFilterText}
        onRowClicked={onRowClicked}
        selected={selected}
        selectedId="oid"
      />
    );
  }
);

export default LoanAppraisalsTable;
