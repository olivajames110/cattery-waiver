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
import { forwardRef, useCallback, useMemo, useState } from "react";

import {
  fileDocGroups,
  getDocTypesByGroup,
} from "../../../../../config/fileDocGroupAndTypes";

import { amber, green } from "@mui/material/colors";
import { head, isBoolean, isString } from "lodash";
import { columnTypesDate } from "../../../../../_src_shared/utils/agGrid/columnTypes/columnTypesDate";
import AgGridTableWrapper from "../../../../../components/agGrid/AgGridTableWrapper";
import { columnTypesBoolean } from "../../../../../utils/agGrid/columnTypes/columnTypesBoolean";
import CellRendererLoanFileActions from "./CellRendererLoanFileActions";

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

const LoanFilesTableOriginal = forwardRef(
  (
    {
      rowData,
      quickFilterText,
      enhancedDetails,
      height = "100%",
      groupByCategory,
      editing,
      onCellValueChanged: parentOnCellValueChanged, // Rename the prop to avoid confusion
      setSelectedRows,
    },
    ref
  ) => {
    const [editingRows, setEditingRows] = useState(new Set());
    const [originalData, setOriginalData] = useState({});

    const startEditing = useCallback(
      (rowId, data) => {
        setEditingRows((prev) => new Set(prev).add(rowId));
        // Create a deep copy of the data to prevent reference issues
        setOriginalData((prev) => ({
          ...prev,
          [rowId]: JSON.parse(JSON.stringify(data)),
        }));

        // Enable full row editing after a short delay
        setTimeout(() => {
          if (ref.current) {
            const api = ref.current.api;
            const rowNode = api.getRowNode(rowId);
            if (rowNode) {
              // Find all editable columns
              const editableColumns = api
                .getColumnDefs()
                .filter(
                  (col) =>
                    col.editable &&
                    (typeof col.editable === "boolean" ||
                      col.editable({ data }))
                )
                .map((col) => col.field);

              // Start editing mode for the row
              if (editableColumns.length > 0) {
                // Focus on the first editable cell to trigger row editing
                api.startEditingCell({
                  rowIndex: rowNode.rowIndex,
                  colKey: editableColumns[0],
                });

                // Then immediately trigger full row editing
                api.setFocusedCell(rowNode.rowIndex, editableColumns[0]);
              }
            }
          }
        }, 100);
      },
      [ref]
    );

    const stopEditing = useCallback((rowId) => {
      setEditingRows((prev) => {
        const newSet = new Set(prev);
        newSet.delete(rowId);
        return newSet;
      });
      setOriginalData((prev) => {
        const newData = { ...prev };
        delete newData[rowId];
        return newData;
      });
    }, []);

    const resetRow = useCallback(
      (rowId) => {
        const original = originalData[rowId];
        if (original && ref.current) {
          const rowNode = ref.current.api.getRowNode(rowId);
          if (rowNode) {
            // Update each field individually to ensure AG-Grid detects all changes
            Object.keys(original).forEach((key) => {
              rowNode.setDataValue(key, original[key]);
            });

            // Force refresh the entire row
            ref.current.api.refreshCells({
              rowNodes: [rowNode],
              force: true,
            });

            // Redraw the row to ensure styles are updated
            ref.current.api.redrawRows({ rowNodes: [rowNode] });
          }
        }
        stopEditing(rowId);
      },
      [originalData, ref, stopEditing]
    );

    const getRowStyle = useCallback(
      (params) => {
        if (editingRows.has(params?.data?._id)) {
          return {
            background: "#e3f2fd",
            borderLeft: `4px solid #2196f3`,
          };
        }
        if (params?.data?.isHidden) {
          return {
            background: amber[50],
            borderLeft: `4px solid ${amber[200]}`,
          };
        }
        if (params?.data?.isFinal) {
          return {
            borderLeft: `4px solid ${green[500]}`,
            background: "#f9fef7",
          };
        }
        return { borderLeft: "3px solid transparent" };
      },
      [editingRows]
    );

    const autoGroupColumnDef = useMemo(
      () => ({
        field: "docGroup",
        headerName: "Document Group",
        minWidth: 220,
        cellRendererParams: {
          suppressCount: true,
        },
        cellStyle: { fontWeight: "bold" },
        comparator: (valueA, valueB) => {
          if (valueA < valueB) return -1;
          if (valueA > valueB) return 1;
          return 0;
        },
      }),
      []
    );

    const onRowClicked = useCallback((params) => {
      if (params.node.group) {
        params.node.setExpanded(!params.node.expanded);
      }
    }, []);

    const columnTypes = useMemo(() => {
      return {
        ...columnTypesBoolean(),
        ...columnTypesDate(),
      };
    }, []);

    const onFileNameChanged = useCallback(
      (params) => {
        const { data, newValue } = params;
        const rowId = data._id;
        let updatedFieldValue = newValue;
        const field = params?.colDef?.field;

        if (field === "file_display_name") {
          // Get the original filename to extract the extension
          const originalFilename =
            originalData[rowId]?.file_display_name || data.file_display_name;
          const originalExtension = originalFilename
            .split(".")
            .pop()
            .toLowerCase();

          // Remove any extension from the new value
          const newValueWithoutExt = newValue.replace(/\.[^/.]+$/, "");

          // Append the original extension
          updatedFieldValue = `${newValueWithoutExt}.${originalExtension}`;

          // Update the data with the corrected filename
          data.file_display_name = updatedFieldValue;

          // Refresh the cell to show the updated value
          params.api.refreshCells({
            rowNodes: [params.node],
            columns: ["file_display_name"],
            force: true,
          });
        }
      },
      [originalData]
    );

    const onDateFieldChanged = useCallback((params) => {
      const { data, newValue } = params;
      const field = params?.colDef?.field;

      if (field === "reportEffectiveDate" && newValue) {
        // Convert the date to ISO string format
        let isoDateString;
        if (newValue instanceof Date) {
          isoDateString = newValue.toISOString();
        } else if (typeof newValue === "string") {
          // If it's already a string, ensure it's in ISO format
          isoDateString = new Date(newValue).toISOString();
        }

        // Update the data with the ISO string
        data.reportEffectiveDate = isoDateString;

        // Refresh the cell
        params.api.refreshCells({
          rowNodes: [params.node],
          columns: ["reportEffectiveDate"],
          force: true,
        });
      }
    }, []);

    const onCellValueChanged = useCallback(
      (params) => {
        if (params.colDef.field === "file_display_name") {
          onFileNameChanged(params);
        } else if (params.colDef.field === "reportEffectiveDate") {
          onDateFieldChanged(params);
        }

        // Call the parent's handler if provided
        if (parentOnCellValueChanged) {
          parentOnCellValueChanged(params);
        }
      },
      [onFileNameChanged, onDateFieldChanged, parentOnCellValueChanged]
    );

    const columnDefs = useMemo(() => {
      return getColumnDefs({
        editingRows,
        startEditing,
        stopEditing,
        resetRow,
        originalData,
        onFileNameChanged,
        groupByCategory,
        onDateFieldChanged,
        editing,
      });
    }, [
      editingRows,
      startEditing,
      stopEditing,
      resetRow,
      originalData,
      onFileNameChanged,
      groupByCategory,
      onDateFieldChanged,
      editing,
    ]);

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

    const rowSelection = useMemo(() => {
      if (editing) {
        return {
          mode: "multiRow",
          checkboxes: true,
          headerCheckboxSelection: true,
        };
      }
      return {};
    }, [editing]);

    const onSelectionChanged = useCallback(
      (params) => {
        const selected = params.api.getSelectedRows();
        setSelectedRows(selected);
      },
      [setSelectedRows]
    );

    return (
      <AgGridTableWrapper
        height={height}
        suppressBorder
        suppressBorderRadius
        simpleTable
        size={4}
      >
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          quickFilterText={quickFilterText}
          getRowStyle={getRowStyle}
          autoGroupColumnDef={autoGroupColumnDef}
          stopEditingWhenCellsLoseFocus
          columnTypes={columnTypes}
          tooltipShowDelay={0}
          tooltipInteraction={true}
          singleClickEdit
          onCellValueChanged={onCellValueChanged}
          domLayout={"autoHeight"}
          tooltipMouseTrack
          onSelectionChanged={onSelectionChanged}
          groupDisplayType={"groupRows"}
          rowSelection={rowSelection}
          allowDragFromColumnsToolPanel={false}
          rowGroupPanelShow={"always"}
          enableCellTextSelection
          onRowClicked={onRowClicked}
        />
      </AgGridTableWrapper>
    );
  }
);

const getColumnDefs = ({
  editingRows,
  startEditing,
  stopEditing,
  resetRow,
  originalData,
  onFileNameChanged,
  groupByCategory,
  onDateFieldChanged,
  editing,
}) => {
  return [
    {
      field: "_id",
      headerName: "ID",
      hide: true,
    },
    {
      width: 150,
      maxWidth: 150,
      flex: 0,
      headerName: "Actions",
      resizable: false,
      hide: editing,
      cellStyle: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: "7px",
      },
      cellRenderer: (params) => {
        if (params.node.group) {
          return params.value;
        }
        return (
          <CellRendererLoanFileActions
            params={params}
            isEditing={editingRows.has(params.data._id)}
            onStartEdit={() => startEditing(params.data._id, params.data)}
            onStopEdit={() => stopEditing(params.data._id)}
            onReset={() => resetRow(params.data._id)}
            originalData={originalData[params.data._id]}
          />
        );
      },
    },
    {
      field: "file_display_name",
      headerName: "Filename",
      sortable: true,
      filter: true,
      resizable: true,
      editable: (params) => editingRows.has(params.data._id),
      flex: 1,
      minWidth: 250,
    },
    {
      field: "docGroup",
      headerName: "Category",
      sortable: true,
      filter: true,
      resizable: true,
      editable: (params) => editingRows.has(params.data._id),
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: fileDocGroups },
      flex: 1,
      maxWidth: 400,
      sort: "asc",
      rowGroup: groupByCategory,
      minWidth: 200,
      showRowGroup: "docGroup",
      onCellValueChanged: (params) => {
        if (params.oldValue !== params.newValue) {
          params.data.docType = null;
          params.api.refreshCells({
            rowNodes: [params.node],
            columns: ["docType"],
            force: true,
          });
        }
      },
    },
    {
      field: "docType",
      headerName: "Document Type",
      sortable: true,
      filter: true,
      resizable: true,
      sort: "asc",
      flex: 1,
      minWidth: 200,
      maxWidth: 400,
      editable: (params) => editingRows.has(params.data._id),
      cellEditor: "agSelectCellEditor",
      cellEditorParams: (params) => {
        const docGroup = params.data.docGroup;
        return {
          values: getDocTypesByGroup(docGroup),
        };
      },
    },
    {
      headerName: "Report Effective Date",
      field: "reportEffectiveDate",
      editable: (params) => editingRows.has(params.data._id),
      type: "date",
      width: 160,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      suppressHeaderFilterButton: true,
      suppressHeaderMenuButton: true,
    },
    {
      headerName: "Report Guideline Expiration Days",
      field: "reportGuidelineExpirationDays",
      editable: (params) => editingRows.has(params.data._id),
      type: "number",
      suppressHeaderFilterButton: true,
      suppressHeaderMenuButton: true,
      wrapHeaderText: true,
      autoHeaderHeight: true,
      width: 180,
    },
    {
      field: "excludeFromExport",
      headerName: "Exclude From Export",
      sortable: true,
      filter: true,
      resizable: true,
      width: 165,
      editable: (params) => editingRows.has(params.data._id),
      cellRenderer: "agCheckboxCellRenderer",
      cellEditor: "agCheckboxCellEditor",
      valueGetter: (params) => {
        if (isBoolean(params?.data?.excludeFromExport)) {
          return params?.data?.excludeFromExport;
        }
        if (isString(params?.data?.excludeFromExport)) {
          if (
            params?.data?.excludeFromExport === "true" ||
            params?.data?.excludeFromExport === "True"
          ) {
            return true;
          }
          if (
            params?.data?.excludeFromExport === "false" ||
            params?.data?.excludeFromExport === "False"
          ) {
            return false;
          }
        }

        return false;
      },
    },
    {
      field: "approvedForThirdParty",
      headerName: "Approved For Third Party",
      sortable: true,
      filter: true,
      resizable: true,
      width: 195,
      cellRenderer: "agCheckboxCellRenderer",
      cellEditor: "agCheckboxCellEditor",
      editable: (params) => editingRows.has(params.data._id),
      valueGetter: (params) => {
        if (isBoolean(params?.data?.approvedForThirdParty)) {
          return params?.data?.approvedForThirdParty;
        }
        if (isString(params?.data?.approvedForThirdParty)) {
          if (
            params?.data?.approvedForThirdParty === "true" ||
            params?.data?.approvedForThirdParty === "True"
          ) {
            return true;
          }
          if (
            params?.data?.approvedForThirdParty === "false" ||
            params?.data?.approvedForThirdParty === "False"
          ) {
            return false;
          }
        }

        return false;
      },
    },
  ];
};

export default LoanFilesTableOriginal;
