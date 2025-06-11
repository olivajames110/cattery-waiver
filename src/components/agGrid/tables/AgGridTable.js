import React, { forwardRef } from "react";
import AgGridTableWrapper from "../AgGridTableWrapper";
import { AgGridReact } from "ag-grid-react";

const AgGridTable = forwardRef(
  (
    {
      columnDefs,
      rowData,
      onRowClicked,
      quickFilterText,
      gridOptions,
      height = "100%",
      autoHeight,
    },
    ref
  ) => {
    return (
      <AgGridTableWrapper
        height={height}
        showOnlyTopBorder
        suppressBorderRadius
        size={4}
      >
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={columnDefs}
          // processPivotResultColGroupDef={processPivotResultColGroupDef}
          // defaultColDef={defaultColDef}
          // columnTypes={columnTypes}
          quickFilterText={quickFilterText}
          // getRowStyle={getRowStyle}
          // grandTotalRow={"bottom"}
          // sideBar={sideBar}
          // initialState={initialState}
          // suppressAggFuncInHeader
          rowGroupPanelShow={"always"}
          // allowDragFromColumnsToolPanel={false}
          // onRowClicked={handleOnRowClicked}
          // pagination
          pivotRowTotals={"before"}
          // enableCharts
          domLayout={"autoHeight"}
          onRowClicked={onRowClicked}
          gridOptions={gridOptions}
        />
      </AgGridTableWrapper>
    );
  }
);

export default AgGridTable;
