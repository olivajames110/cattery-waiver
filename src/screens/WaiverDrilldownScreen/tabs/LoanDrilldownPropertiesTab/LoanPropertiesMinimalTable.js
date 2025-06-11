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

const LoanPropertiesMinimalTable = forwardRef(
  (
    { rowData, quickFilterText, simpleTable = true, height, sx, gridOptions },
    ref
  ) => {
    const navigate = useNavigate();
    const { id: loanId } = useParams();

    const columnDefs = useMemo(
      () => [
        {
          field: "address",
          headerName: "Address",
          flex: 1,
          minWidth: 200,
          valueFormatter: (p) => {
            return p?.data?.address?.fullAddress;
          },
        },
        { field: "propertyType", headerName: "Property Type", width: 150 },
        {
          field: "asIsValue",
          headerName: "As-Is Value",
          width: 150,
          type: "dollar",
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
        cellStyle: { cursor: "pointer" },
        suppressHeaderMenuButton: true,
        headerCheckboxSelectionFilteredOnly: true,
        menuTabs: ["filterMenuTab"],
      }),
      []
    );

    const columnTypes = useMemo(() => {
      return {
        ...columnTypesDate(),
        ...columnTypesPercent(),
        ...columnTypesDollar(),
        // ...columnTypesBoolean(),
      };
    }, []);

    const onRowClicked = useCallback(
      (params) => {
        navigate(`/loan/${loanId}/properties/${params?.data?._id}`);
      },
      [loanId]
    );

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
          allowDragFromColumnsToolPanel={false}
          gridOptions={gridOptions}
          onRowClicked={onRowClicked}
          // domLayout={"autoHeight"}
          // rowGroupPanelShow={"always"}

          onGridReady={onGridReady}
        />
      </AgGridTableWrapper>
    );
  }
);

export default LoanPropertiesMinimalTable;
