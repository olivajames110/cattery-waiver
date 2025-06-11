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
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  fileDocGroups,
  getDocTypesByGroup,
} from "../../../../../config/fileDocGroupAndTypes";

import { Button, Card, IconButton, Tooltip } from "@mui/material";
// Import lodash helpers directly
import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import size from "lodash/size";

import { useDispatch, useSelector } from "react-redux";
import { columnTypesDate } from "../../../../../_src_shared/utils/agGrid/columnTypes/columnTypesDate";
import { columnTypesNumber } from "../../../../../_src_shared/utils/agGrid/columnTypes/columnTypesNumber";
import AgGridTableWrapper from "../../../../../components/agGrid/AgGridTableWrapper";
import Flx from "../../../../../components/layout/Flx";
import Txt from "../../../../../components/typography/Txt";
import { useLoanFilesHook } from "../../../../../hooks/useLoanFilesHook";

import NumberInput from "../../../../../_src_shared/components/inputs/NumberInput";
import DateInput from "../../../../../components/inputs/DateInput";
import SelectInput from "../../../../../components/inputs/SelectInput";
import InputWrapper from "../../../../../components/inputs/shared/InputWrapper";
import TextInput from "../../../../../components/inputs/TextInput";
import CellRendererLoanFileActions from "./CellRendererLoanFileActions";

import { CloseOutlined } from "@mui/icons-material";

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

const LoanFilesTableChangedRows = ({
  files,
  groupByCategory,
  editing,
  changedRows,
  setChangedRows,
}) => {
  const gridRef = useRef(null);
  const modalContentRef = useRef(null);

  // Local state for the grid’s row data
  const [rowData, setRowData] = useState([]);

  // Track which rows are selected
  const [selectedRows, setSelectedRows] = useState([]);

  // This array will accumulate all changes made while editing
  // const [changedRows, setChangedRows] = useState([]);

  // Keep a stable copy of the "original" rows for diffing
  const originalRowData = useMemo(() => files, [files]);

  /** COLUMN DEFINITIONS **/
  const columnDefs = useMemo(
    () => [
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
          return <CellRendererLoanFileActions params={params} />;
        },
      },
      {
        headerName: "Filename",
        field: "file_display_name",
        flex: 1,
        minWidth: 250,
        cellEditor: "agTextCellEditor",
        editable: editing,
      },
      {
        headerName: "Category",
        field: "docGroup",
        rowGroup: groupByCategory,
        sort: "asc",
        showRowGroup: "docGroup",
        width: 220,
        editable: editing,
        cellEditor: "agRichSelectCellEditor",
        cellEditorPopup: true,
        cellEditorParams: {
          values: fileDocGroups || [],
        },
      },
      {
        headerName: "Document Type",
        field: "docType",
        sort: "asc",
        editable: editing,
        width: 220,
        cellEditor: "agRichSelectCellEditor",
        cellEditorPopup: true,
        cellEditorParams: (params) => {
          return {
            values: getDocTypesByGroup(params.data.docGroup),
          };
        },
      },
      {
        headerName: "Report Effective Date",
        field: "reportEffectiveDate",
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
        type: "number",
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 140,
      },
    ],
    [groupByCategory, editing]
  );

  const columnTypes = useMemo(() => {
    return {
      ...columnTypesDate(),
      ...columnTypesNumber(),
    };
  }, []);

  const getRowId = useCallback((params) => {
    return params.data._id;
  }, []);

  const rowSelection = useMemo(() => {
    if (editing) {
      return {
        mode: "multiRow",
      };
    }
    return {};
  }, [editing]);

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

  /** LOAD INITIAL ROW DATA **/
  useEffect(() => {
    // Copy “files” into our local state so we can edit
    setRowData(files.map((f) => ({ ...f })));
    // Clearing any prior changedRows if "files" has changed
    setChangedRows([]);
  }, [files]);

  /** HANDLE ROW SELECTION **/
  const handleRowSelectionChange = useCallback((params) => {
    const selected = params.api.getSelectedRows();
    setSelectedRows(selected);
  }, []);

  /** RESET EVERYTHING: rowData back to original, clear selection, clear changedRows **/
  const onResetFilesClick = useCallback(() => {
    setRowData(originalRowData.map((r) => ({ ...r })));
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.deselectAll();
    }
    setChangedRows([]);
  }, [originalRowData]);

  const handleDeselectAllRows = useCallback(() => {
    if (gridRef.current && gridRef.current.api) {
      gridRef.current.api.deselectAll();
    }
    setSelectedRows([]);
    onResetFilesClick();
  }, [onResetFilesClick]);

  /**
   * Whenever a cell changes, we:
   * 1) Update the grid via applyTransaction({ update: [...] })
   * 2) Re-enter editing (so we don’t lose focus)
   * 3) Update our changedRows[] array by diffing newValue vs original value
   */
  const handleCellValueChanged = useCallback(
    (params) => {
      const { colDef, data, newValue } = params;
      const field = colDef.field;
      const rowId = data._id;
      const originalRow = originalRowData.find((r) => r._id === rowId) || {};

      // Helper to add/merge a field into changedRows
      const addOrUpdateChange = (fieldName, value) => {
        setChangedRows((prev) => {
          const exists = prev.find((item) => item._id === rowId);
          if (exists) {
            // Merge or delete the field from that object
            if (value !== undefined) {
              return prev.map((item) =>
                item._id === rowId ? { ...item, [fieldName]: value } : item
              );
            } else {
              // Remove that field if value is undefined (meaning reverted to original)
              const updated = { ...exists };
              delete updated[fieldName];
              // If only _id remains, drop the entire object
              const keys = Object.keys(updated);
              if (keys.length === 1 && keys[0] === "_id") {
                return prev.filter((item) => item._id !== rowId);
              }
              return prev.map((item) => (item._id === rowId ? updated : item));
            }
          } else {
            // Create new entry only if value !== undefined
            if (value !== undefined) {
              return [...prev, { _id: rowId, [fieldName]: value }];
            }
            return prev;
          }
        });
      };

      // 1) Filename
      if (field === "file_display_name") {
        const originalExtension = data.name.split(".").pop().toLowerCase();
        const newValueWithoutExt = newValue.replace(/\.[^/.]+$/, "");
        data.file_display_name = `${newValueWithoutExt}.${originalExtension}`;

        params.api.applyTransaction({ update: [data] });

        // Compare to original; if it differs, add to changedRows; otherwise remove
        const origValue = originalRow.file_display_name || "";
        if (data.file_display_name !== origValue) {
          addOrUpdateChange("file_display_name", data.file_display_name);
        } else {
          addOrUpdateChange("file_display_name", undefined);
        }

        return;
      }

      // 2) Category (docGroup)
      if (field === "docGroup") {
        data.docGroup = newValue;
        // If there's already a docType on that row, clear it
        const oldDocType = data.docType;
        data.docType = "";

        params.api.applyTransaction({ update: [data] });

        // Re‐enter editing on the same cell (or switch to docType if desired)
        setTimeout(() => {
          params.api.startEditingCell({
            rowIndex: params.node.rowIndex,
            colKey: "docGroup",
          });
        }, 0);

        // Diff docGroup vs original:
        const origDocGroup = originalRow.docGroup || "";
        if (data.docGroup !== origDocGroup) {
          addOrUpdateChange("docGroup", data.docGroup);
        } else {
          addOrUpdateChange("docGroup", undefined);
        }

        // Also diff docType (because we cleared it)
        const origDocType = originalRow.docType || "";
        if (data.docType !== origDocType) {
          addOrUpdateChange("docType", data.docType);
        } else {
          addOrUpdateChange("docType", undefined);
        }

        return;
      }

      // 3) Document Type (docType) — only when docGroup didn’t just change
      if (field === "docType") {
        data.docType = newValue;
        params.api.applyTransaction({ update: [data] });

        const origValue = originalRow.docType || "";
        if (data.docType !== origValue) {
          addOrUpdateChange("docType", data.docType);
        } else {
          addOrUpdateChange("docType", undefined);
        }

        return;
      }

      // 4) Report Effective Date
      if (field === "reportEffectiveDate") {
        if (newValue instanceof Date) {
          data.reportEffectiveDate = newValue.toISOString();
        } else if (typeof newValue === "string" && newValue) {
          if (!newValue.includes("T") || !newValue.endsWith("Z")) {
            const dateObj = new Date(newValue);
            if (!isNaN(dateObj.getTime())) {
              data.reportEffectiveDate = dateObj.toISOString();
            }
          }
        }
        params.api.applyTransaction({ update: [data] });

        const origValue = originalRow.reportEffectiveDate || "";
        if (data.reportEffectiveDate !== origValue) {
          addOrUpdateChange("reportEffectiveDate", data.reportEffectiveDate);
        } else {
          addOrUpdateChange("reportEffectiveDate", undefined);
        }
        return;
      }

      // 5) Report Guideline Expiration Days
      if (field === "reportGuidelineExpirationDays") {
        data.reportGuidelineExpirationDays = newValue;
        params.api.applyTransaction({ update: [data] });

        const origValue = originalRow.reportGuidelineExpirationDays;
        if (data.reportGuidelineExpirationDays !== origValue) {
          addOrUpdateChange(
            "reportGuidelineExpirationDays",
            data.reportGuidelineExpirationDays
          );
        } else {
          addOrUpdateChange("reportGuidelineExpirationDays", undefined);
        }
        return;
      }
    },
    [originalRowData]
  );

  /**
   * When the bulk toolbar updates metadata for multiple rows at once,
   * we must also update changedRows for each affected row.
   */
  const handleMetadataUpdate = useCallback(
    ({
      newDocGroup,
      newDocType,
      newEffectiveDate,
      newGuidelineExpirationDays,
    }) => {
      if (!selectedRows || selectedRows.length === 0) return;

      const selectedRowIds = selectedRows.map((row) => row.id);
      setRowData((prev) => {
        const updatedRows = [...prev];
        selectedRowIds.forEach((id) => {
          const index = updatedRows.findIndex((row) => row.id === id);
          if (index !== -1) {
            const rowToUpdate = updatedRows[index];
            const updatedRow = { ...rowToUpdate };

            // If the user sets a new DocGroup in bulk
            if (newDocGroup !== undefined) {
              const originalRow =
                originalRowData.find((r) => r._id === id) || {};

              updatedRow.docGroup = newDocGroup;
              updatedRow.docType = ""; // clear docType
              if (newDocGroup !== originalRow.docGroup) {
                setChangedRows((prev) => {
                  // merge into changedRows for this row
                  const exists = prev.find((item) => item._id === id);
                  if (exists) {
                    return prev.map((item) =>
                      item._id === id
                        ? { ...item, docGroup: newDocGroup }
                        : item
                    );
                  } else {
                    return [...prev, { _id: id, docGroup: newDocGroup }];
                  }
                });
              } else {
                // If they picked the same group as original, remove it from changedRows
                setChangedRows((prev) => {
                  const exists = prev.find((item) => item._id === id);
                  if (!exists) return prev;
                  const updated = { ...exists };
                  delete updated.docGroup;
                  // If no other fields, drop entirely
                  const keys = Object.keys(updated);
                  if (keys.length === 1 && keys[0] === "_id") {
                    return prev.filter((item) => item._id !== id);
                  }
                  return prev.map((item) => (item._id === id ? updated : item));
                });
              }

              // Also handle docType cleared
              const origDocType = originalRow.docType || "";
              if ("" !== origDocType) {
                setChangedRows((prev) => {
                  const exists = prev.find((item) => item._id === id);
                  if (exists) {
                    return prev.map((item) =>
                      item._id === id ? { ...item, docType: "" } : item
                    );
                  } else {
                    return [...prev, { _id: id, docType: "" }];
                  }
                });
              } else {
                // If original docType was already "", remove any stale docType entry
                setChangedRows((prev) => {
                  const exists = prev.find(
                    (item) => item._id === id && "docType" in item
                  );
                  if (!exists) return prev;
                  const updated = { ...exists };
                  delete updated.docType;
                  const keys = Object.keys(updated);
                  if (keys.length === 1 && keys[0] === "_id") {
                    return prev.filter((item) => item._id !== id);
                  }
                  return prev.map((item) => (item._id === id ? updated : item));
                });
              }
            }

            // If in bulk they set a new DocType (and not changing docGroup this time)
            if (newDocType !== undefined && newDocGroup === undefined) {
              const originalRow =
                originalRowData.find((r) => r._id === id) || {};
              updatedRow.docType = newDocType || "";
              if (updatedRow.docType !== originalRow.docType) {
                setChangedRows((prev) => {
                  const exists = prev.find((item) => item._id === id);
                  if (exists) {
                    return prev.map((item) =>
                      item._id === id
                        ? { ...item, docType: updatedRow.docType }
                        : item
                    );
                  } else {
                    return [...prev, { _id: id, docType: updatedRow.docType }];
                  }
                });
              } else {
                // They reverted docType to original
                setChangedRows((prev) => {
                  const exists = prev.find((item) => item._id === id);
                  if (!exists) return prev;
                  const updated = { ...exists };
                  delete updated.docType;
                  const keys = Object.keys(updated);
                  if (keys.length === 1 && keys[0] === "_id") {
                    return prev.filter((item) => item._id !== id);
                  }
                  return prev.map((item) => (item._id === id ? updated : item));
                });
              }
            }

            // If they set a new Effective Date
            if (newEffectiveDate !== undefined) {
              const originalRow =
                originalRowData.find((r) => r._id === id) || {};
              let newISO = "";
              if (newEffectiveDate instanceof Date) {
                newISO = newEffectiveDate.toISOString();
              } else {
                newISO = newEffectiveDate;
              }
              updatedRow.reportEffectiveDate = newISO;
              if (newISO !== (originalRow.reportEffectiveDate || "")) {
                setChangedRows((prev) => {
                  const exists = prev.find((item) => item._id === id);
                  if (exists) {
                    return prev.map((item) =>
                      item._id === id
                        ? { ...item, reportEffectiveDate: newISO }
                        : item
                    );
                  } else {
                    return [...prev, { _id: id, reportEffectiveDate: newISO }];
                  }
                });
              } else {
                setChangedRows((prev) => {
                  const exists = prev.find((item) => item._id === id);
                  if (!exists) return prev;
                  const updated = { ...exists };
                  delete updated.reportEffectiveDate;
                  const keys = Object.keys(updated);
                  if (keys.length === 1 && keys[0] === "_id") {
                    return prev.filter((item) => item._id !== id);
                  }
                  return prev.map((item) => (item._id === id ? updated : item));
                });
              }
            }

            // If they set new Guideline Expiration Days
            if (newGuidelineExpirationDays !== undefined) {
              const originalRow =
                originalRowData.find((r) => r._id === id) || {};
              updatedRow.reportGuidelineExpirationDays =
                newGuidelineExpirationDays;
              if (
                newGuidelineExpirationDays !==
                originalRow.reportGuidelineExpirationDays
              ) {
                setChangedRows((prev) => {
                  const exists = prev.find((item) => item._id === id);
                  if (exists) {
                    return prev.map((item) =>
                      item._id === id
                        ? {
                            ...item,
                            reportGuidelineExpirationDays:
                              newGuidelineExpirationDays,
                          }
                        : item
                    );
                  } else {
                    return [
                      ...prev,
                      {
                        _id: id,
                        reportGuidelineExpirationDays:
                          newGuidelineExpirationDays,
                      },
                    ];
                  }
                });
              } else {
                setChangedRows((prev) => {
                  const exists = prev.find((item) => item._id === id);
                  if (!exists) return prev;
                  const updated = { ...exists };
                  delete updated.reportGuidelineExpirationDays;
                  const keys = Object.keys(updated);
                  if (keys.length === 1 && keys[0] === "_id") {
                    return prev.filter((item) => item._id !== id);
                  }
                  return prev.map((item) => (item._id === id ? updated : item));
                });
              }
            }

            updatedRows[index] = updatedRow;
          }
        });

        return updatedRows;
      });

      // Force‐refresh the grid so the bulk values show up
      setTimeout(() => {
        if (gridRef.current && gridRef.current.api) {
          gridRef.current.api.refreshCells();
        }
      }, 0);
    },
    [selectedRows, originalRowData]
  );

  if (isEmpty(files)) {
    return null;
  }

  return (
    <Flx flexGrow={1} column gap={1}>
      <Flx fw jb ac>
        {isEmpty(selectedRows) ? null : (
          <BulkActionsToolbar
            selectedRows={selectedRows}
            onMetadataUpdate={handleMetadataUpdate}
            onDeselectAllRows={handleDeselectAllRows}
            onReset={onResetFilesClick}
            changedRows={changedRows}
            onCancel={() => {
              // “Cancel” clears all edits
              onResetFilesClick();
            }}
          />
        )}
      </Flx>

      <Flx
        column
        sx={{
          overflow: "hidden",
          flexGrow: 1,
          gap: 2,
        }}
      >
        <div ref={modalContentRef}>
          <AgGridTableWrapper height="100%" simpleTable size={4}>
            <AgGridReact
              ref={gridRef}
              getRowId={getRowId}
              rowData={rowData}
              columnDefs={columnDefs}
              singleClickEdit
              columnTypes={columnTypes}
              stopEditingWhenCellsLoseFocus
              groupDisplayType={"groupRows"}
              autoGroupColumnDef={autoGroupColumnDef}
              editType={"fullRow"}
              onSelectionChanged={handleRowSelectionChange}
              domLayout={"autoHeight"}
              onCellValueChanged={handleCellValueChanged}
              // popupParent={modalContentRef.current}
              rowSelection={rowSelection}
            />
          </AgGridTableWrapper>
        </div>
      </Flx>
    </Flx>
  );
};

const BulkActionsToolbar = ({
  selectedRows,
  onDeselectAllRows,
  onReset,
  changedRows,
  onMetadataUpdate,
  onCancel,
}) => {
  const [bulkFilename, setBulkFilename] = useState("");
  const [bulkDocGroup, setBulkDocGroup] = useState(null);
  const [bulkDocType, setBulkDocType] = useState(null);
  const [bulkEffectiveDate, setBulkEffectiveDate] = useState("");
  const [bulkNumExpirationDays, setBulkNumExpirationDays] = useState(null);

  // Whenever selection changes, populate the bulk fields if exactly 1 is selected
  useEffect(() => {
    if (size(selectedRows) === 1) {
      const file = selectedRows[0];
      setBulkFilename(file?.file_display_name || "");
      setBulkDocGroup(file?.docGroup || null);
      setBulkDocType(file?.docType || null);
      setBulkEffectiveDate(file?.reportEffectiveDate || "");
      setBulkNumExpirationDays(file?.reportGuidelineExpirationDays);
      return;
    }
    if (isEmpty(selectedRows) || size(selectedRows) > 1) {
      setBulkFilename("");
      setBulkDocGroup(null);
      setBulkDocType(null);
      setBulkEffectiveDate("");
      setBulkNumExpirationDays(null);
    }
  }, [selectedRows]);

  if (isEmpty(selectedRows)) {
    return null;
  }

  const onGroupChange = (group) => {
    setBulkDocGroup(group);
    onMetadataUpdate({ newDocGroup: group });
  };
  const onTypeChange = (type) => {
    setBulkDocType(type);
    onMetadataUpdate({ newDocType: type });
  };
  const onEffectiveDateChange = (date) => {
    setBulkEffectiveDate(date);
    onMetadataUpdate({ newEffectiveDate: date });
  };
  const onNumExpirationDaysChange = (num) => {
    setBulkNumExpirationDays(num);
    onMetadataUpdate({ newGuidelineExpirationDays: num });
  };
  const onFilenameChange = (txt) => {
    setBulkFilename(txt);
    onMetadataUpdate({ file_display_name: txt });
  };

  return (
    <Card
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        boxShadow:
          "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
        width: "100%",
        p: 1,
        borderRadius: "0px",
        zIndex: 11111,
        ".MuiSelect-select, .MuiInputBase-root, .txt, label": {
          fontSize: "12px",
        },
        label: {
          mb: 0,
        },
      }}
    >
      <Flx fw jb ac gap={6} sx={{ p: 1 }}>
        <Flx center ac gap={1}>
          <Tooltip
            placement="top-start"
            title={`Deselect All`}
            disableInteractive
          >
            <IconButton
              onClick={onDeselectAllRows}
              variant="outlined"
              size="small"
            >
              <CloseOutlined className="thin" />
            </IconButton>
          </Tooltip>
          <Txt sx={{ lineHeight: "normal" }} bold>
            {`Selected Rows (${size(selectedRows)})`}
          </Txt>
        </Flx>

        <Flx ac center gap={2.5} sx={{ flexGrow: 1 }}>
          <InputWrapper sx={{ minWidth: "200px" }} label="File Name">
            <TextInput
              value={bulkFilename}
              placeholder="File name"
              onChange={onFilenameChange}
            />
          </InputWrapper>

          <InputWrapper sx={{ minWidth: "200px" }} label="Category">
            <SelectInput
              value={bulkDocGroup}
              placeholder="Document Group"
              options={fileDocGroups}
              onChange={onGroupChange}
            />
          </InputWrapper>

          <InputWrapper label="Document Type" sx={{ minWidth: "200px" }}>
            {isNil(bulkDocGroup) ? (
              <SelectInput
                value={bulkDocType}
                placeholder="Document Group Required"
                options={getDocTypesByGroup(bulkDocGroup) || []}
                onChange={onTypeChange}
                disabled={
                  isNil(bulkDocGroup) ||
                  isEmpty(getDocTypesByGroup(bulkDocGroup))
                }
              />
            ) : (
              <SelectInput
                value={bulkDocType}
                placeholder="Select Document Type"
                options={getDocTypesByGroup(bulkDocGroup) || []}
                onChange={onTypeChange}
              />
            )}
          </InputWrapper>

          <InputWrapper label="Report Effective Date">
            <DateInput
              value={bulkEffectiveDate}
              placeholder="Effective Date"
              onChange={onEffectiveDateChange}
            />
          </InputWrapper>

          <InputWrapper label="Report Guideline Expiration Days">
            <NumberInput
              value={bulkNumExpirationDays}
              placeholder="Exp. Days"
              onChange={onNumExpirationDaysChange}
            />
          </InputWrapper>
        </Flx>

        <Flx gap={1}>
          <Button
            onClick={() => {
              console.log("Apply Bulk Update clicked");
              console.log("changedRows", changedRows);
            }}
            variant="contained"
            size="small"
          >
            Update
          </Button>

          <Button
            onClick={onCancel}
            variant="outlined"
            color="secondary"
            size="small"
          >
            Cancel
          </Button>
        </Flx>
      </Flx>
    </Card>
  );
};

export default LoanFilesTableChangedRows;
