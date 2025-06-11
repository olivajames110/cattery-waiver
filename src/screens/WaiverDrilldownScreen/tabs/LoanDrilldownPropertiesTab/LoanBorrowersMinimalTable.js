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
import React, { forwardRef, useCallback, useMemo } from "react";

import AgGridClickableTable from "../../../../components/agGrid/tables/AgGridClickableTable";
import AgGridTableWrapper from "../../../../components/agGrid/AgGridTableWrapper";
import { columnTypesDate } from "../../../../utils/agGrid/columnTypes/columnTypesDate";
import { columnTypesPercent } from "../../../../_src_shared/utils/agGrid/columnTypes/columnTypesPercent";
import { columnTypesDollar } from "../../../../utils/agGrid/columnTypes/columnTypesDollar";
import { agApiSizeColumnsToFit } from "../../../../_src_shared/utils/agGrid/api/agApiSizeColumnsToFit";
import { AgGridReact } from "ag-grid-react";
import { useNavigate, useParams } from "react-router-dom";

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

const LoanBorrowersMinimalTable = forwardRef(
  (
    {
      rowData,

      quickFilterText,
      simpleTable = true,
      height,
      sx,
      gridOptions,
    },
    ref
  ) => {
    const navigate = useNavigate();
    const { id: loanId } = useParams();

    const columnDefs = useMemo(
      () => [
        {
          headerName: "Name",
          field: "firstName",
          flex: 1,
          minWidth: 200,
          valueFormatter: (params) => {
            return `${params.data?.firstName} ${params.data?.lastName}`;
          },
        },
        {
          headerName: "Email Address",
          field: "emailAddress",
        },
        {
          headerName: "Phone",
          field: "phone",
        },

        {
          headerName: "DOB",
          field: "dateOfBirth",
          type: "date",
          width: 150,
        },
      ],
      []
    );

    const defaultColDef = useMemo(
      () => ({
        filter: true,
        enableRowGroup: true,
        enablePivot: true,
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
        headerCheckboxSelectionFilteredOnly: true,
        cellStyle: { cursor: "pointer" },
        menuTabs: ["filterMenuTab"],
      }),
      []
    );
    const onRowClicked = useCallback(
      (params) => {
        navigate(`/loan/${loanId}/borrowers/${params?.data?._id}`);
      },
      [loanId]
    );

    const columnTypes = useMemo(() => {
      return {
        ...columnTypesDate(),
        ...columnTypesPercent(),
        ...columnTypesDollar(),
      };
    }, []);

    const onGridReady = useCallback((params) => {
      if (params?.api) {
        params?.api?.autoSizeAllColumns();
      }
    }, []);

    const onFirstDataRendered = useCallback((params) => {
      agApiSizeColumnsToFit(params);
    }, []);

    return (
      <AgGridTableWrapper height={height} simpleTable={simpleTable} sx={sx}>
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          onFirstDataRendered={onFirstDataRendered}
          columnTypes={columnTypes}
          onRowClicked={onRowClicked}
          gridOptions={gridOptions}
          // domLayout={"autoHeight"}
          // rowGroupPanelShow={"always"}
          enableCellTextSelection
          onGridReady={onGridReady}
        />
      </AgGridTableWrapper>
    );
  }
);

export default LoanBorrowersMinimalTable;
