// src/components/LoanFilesTableWithImports/LoanFilesTableWithImports.jsx
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
import { useEffect, useRef, useState } from "react";

import { CloseOutlined } from "@mui/icons-material";
import { Button, Card, IconButton, Tooltip } from "@mui/material";

import isEmpty from "lodash/isEmpty";
import isNil from "lodash/isNil";
import size from "lodash/size";

import AgGridTableWrapper from "../../../../../components/agGrid/AgGridTableWrapper";
import Flx from "../../../../../components/layout/Flx";
import Txt from "../../../../../components/typography/Txt";

import NumberInput from "../../../../../_src_shared/components/inputs/NumberInput";
import DateInput from "../../../../../components/inputs/DateInput";
import SelectInput from "../../../../../components/inputs/SelectInput";
import InputWrapper from "../../../../../components/inputs/shared/InputWrapper";
import TextInput from "../../../../../components/inputs/TextInput";

import {
  fileDocGroups,
  getDocTypesByGroup,
} from "../../../../../config/fileDocGroupAndTypes";
import {
  useAutoGroupColumnDef,
  useColumnDefs,
  useColumnTypes,
  useGetRowId,
  useHandleCellValueChanged,
  useHandleDeselectAllRows,
  useHandleMetadataUpdate,
  useHandleRowSelectionChange,
  useOnResetFilesClick,
  useOriginalRowData,
  useRowSelection,
} from "./hooks";

// import {
//   useOriginalRowData,
//   useColumnDefs,
//   useColumnTypes,
//   useGetRowId,
//   useRowSelection,
//   useAutoGroupColumnDef,
//   useHandleRowSelectionChange,
//   useOnResetFilesClick,
//   useHandleDeselectAllRows,
//   useHandleCellValueChanged,
//   useHandleMetadataUpdate,
// } from "./hooks";

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

const LoanFilesTableWithImports = ({
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

  // 1) Keep a stable copy of "original" rows for diffing
  const originalRowData = useOriginalRowData(files);

  // 2) COLUMN DEFINITIONS
  const columnDefs = useColumnDefs(groupByCategory, editing);

  // 3) COLUMN TYPES (date/number)
  const columnTypes = useColumnTypes();

  // 4) Row ID extractor
  const getRowId = useGetRowId();

  // 5) Row selection config
  const rowSelection = useRowSelection(editing);

  // 6) Auto‐group column definition
  const _autoGroupColumnDef = useAutoGroupColumnDef();

  // 7) Handle row selection changes
  const handleRowSelectionChange = useHandleRowSelectionChange(setSelectedRows);

  // 8) Reset button callback
  const onResetFilesClick = useOnResetFilesClick(
    originalRowData,
    setChangedRows,
    setRowData,
    gridRef
  );

  // 9) Deselect all rows callback
  const handleDeselectAllRows = useHandleDeselectAllRows(
    onResetFilesClick,
    setSelectedRows,
    gridRef
  );

  // 10) Whenever a cell changes
  const handleCellValueChanged = useHandleCellValueChanged(
    originalRowData,
    setChangedRows
  );

  // 11) Bulk metadata update
  const handleMetadataUpdate = useHandleMetadataUpdate(
    selectedRows,
    originalRowData,
    setRowData,
    setChangedRows,
    gridRef
  );

  /** LOAD INITIAL ROW DATA **/
  useEffect(() => {
    // Copy “files” into our local state so we can edit
    setRowData(files.map((f) => ({ ...f })));
    // Clearing any prior changedRows if "files" has changed
    setChangedRows([]);
  }, [files, setChangedRows]);

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
              autoGroupColumnDef={_autoGroupColumnDef}
              editType={"fullRow"}
              onSelectionChanged={handleRowSelectionChange}
              domLayout={"autoHeight"}
              onCellValueChanged={handleCellValueChanged}
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

export default LoanFilesTableWithImports;
