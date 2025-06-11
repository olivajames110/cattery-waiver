import { ModuleRegistry } from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MasterDetailModule,
  MultiFilterModule,
  PivotModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  SetFilterModule,
  SideBarModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import { forwardRef, useCallback, useEffect, useMemo, useRef } from "react";

import { blue } from "@mui/material/colors";
import { agApiAutoSizeColumns } from "../../../_src_shared/utils/agGrid/api/agApiAutoSizeColumns";

import AgGridTableWrapper from "../AgGridTableWrapper";
import { useNavigate, useParams } from "react-router-dom";
import { agApiSizeColumnsToFit } from "../../../_src_shared/utils/agGrid/api/agApiSizeColumnsToFit";
import { columnTypesDate } from "../../../_src_shared/utils/agGrid/columnTypes/columnTypesDate";
import { columnTypesPercent } from "../../../_src_shared/utils/agGrid/columnTypes/columnTypesPercent";
import { columnTypesDollar } from "../../../_src_shared/utils/agGrid/columnTypes/columnTypesDollar";
import { columnTypesBoolean } from "../../../_src_shared/utils/agGrid/columnTypes/columnTypesBoolean";

ModuleRegistry.registerModules([
  SideBarModule,
  RowGroupingPanelModule,
  MultiFilterModule,
  RowGroupingModule,
  PivotModule,
  TreeDataModule,
  FiltersToolPanelModule,
  ColumnsToolPanelModule,
  MasterDetailModule,
  SetFilterModule,
]);

const AgGridClickableTable = forwardRef(
  (
    {
      rowData,
      columnDefs,
      quickFilterText,
      height,
      selectedId,
      path,
      simpleTable = true,
      gridOptions,
      masterDetail, // your custom detail-component
    },
    ref
  ) => {
    const { id: loanId } = useParams();
    const navigate = useNavigate();
    const gridApiRef = useRef(null);

    // 1) Block clicks *inside* the detail pane
    const handleOnRowClicked = useCallback(
      (params) => {
        if (params.node.detail) return;

        const dataId = params.data?._id;
        if (dataId === selectedId && selectedId) {
          navigate(`/loan/${loanId}/${path}`);
        } else {
          navigate(`/loan/${loanId}/${path}/${dataId}`);
        }
      },
      [selectedId, path, loanId, navigate]
    );

    // 2) Whenever data changes, re-expand the selected row (if any)
    const onRowDataChanged = useCallback(
      (params) => {
        if (!selectedId) {
          // no ID → collapse everything
          params.api.forEachNode((node) => node.setExpanded(false));
        } else {
          // ID present → keep that one open
          params.api.forEachNode((node) =>
            node.setExpanded(node.data?._id === selectedId)
          );
        }
      },
      [selectedId]
    );

    // 3) Also collapse/expand on URL changes
    useEffect(() => {
      if (!gridApiRef.current) return;
      gridApiRef.current.forEachNode((node) => {
        node.setExpanded(node.data?._id === selectedId);
      });
    }, [selectedId]);

    const _columnDefs = useMemo(() => columnDefs, [columnDefs]);

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
      []
    );

    const columnTypes = useMemo(
      () => ({
        ...columnTypesDate(),
        ...columnTypesPercent(),
        ...columnTypesDollar(),
        ...columnTypesBoolean(),
      }),
      []
    );

    const getRowStyle = useCallback(
      (params) =>
        params?.data?._id === selectedId
          ? {
              fontWeight: 700,
              //
              // background: "red",
              background: "#eff7fe",
              // borderLeft: `4px solid ${blue[200]}`,
            }
          : null,
      [selectedId]
    );

    const onGridReady = useCallback((params) => {
      gridApiRef.current = params.api;
      params.api.autoSizeAllColumns();
    }, []);

    const onFirstDataRendered = useCallback(
      (params) => {
        // agApiAutoSizeColumns(params);
        // agApiSizeColumnsToFit(params);
        params.api.forEachNode((node) => {
          node.setExpanded(node.data?._id === selectedId);
        });
      },
      [selectedId]
    );

    return (
      <AgGridTableWrapper
        suppressMinHeightWhenPopulated={rowData}
        height={height}
        // noBorder
        // borderRadius={0}
        // noBorderRadius
        simpleTable={simpleTable}
        sx={{ minWidth: "340px" }}
      >
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={_columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          getRowStyle={getRowStyle}
          stopEditingWhenCellsLoseFocus
          onFirstDataRendered={onFirstDataRendered}
          tooltipShowDelay={0}
          tooltipInteraction={true}
          tooltipMouseTrack
          columnTypes={columnTypes}
          allowDragFromColumnsToolPanel={false}
          gridOptions={gridOptions}
          domLayout={"autoHeight"}
          /* ↓-- MASTER / DETAIL PROPS --↓ */
          // masterDetail={true}
          keepDetailRows={true} // keep panels alive :contentReference[oaicite:2]{index=2}
          // detailCellRenderer={detailCellRenderer}
          detailCellRendererParams={{ refreshStrategy: "rows" }} // in-place refresh :contentReference[oaicite:3]{index=3}
          detailRowAutoHeight={true}
          /* handle data changes without collapsing */
          onRowDataChanged={onRowDataChanged}
          /* all your existing events */
          // onGridReady={onGridReady}
          onRowClicked={handleOnRowClicked}
        />
      </AgGridTableWrapper>
    );
  }
);

export default AgGridClickableTable;
