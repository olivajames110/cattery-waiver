// src/screens/LoanDrilldownScreen/tabs/LoanDrilldownFilesTab/LoanFilesTable/LoanFilesTable.jsx
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
import { useCallback, useEffect, useRef, useState } from "react";

import { CloseOutlined } from "@mui/icons-material";
import { Card, IconButton, Tooltip } from "@mui/material";

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
  useRowSelection,
} from "./hooks";
import { useGetRowStyles } from "./hooks/useGetRowStyles";
import { agApiSizeColumnsToFit } from "../../../../../_src_shared/utils/agGrid/api/agApiSizeColumnsToFit";

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

const LoanFilesTable = ({
  rowData,
  setRowData,
  editing,
  selectedRows,
  setSelectedRows,
  groupByCategory,
  quickFilter,
  setChangedRows,
}) => {
  const gridRef = useRef(null);

  //
  // Capture the “original” snapshot once so diffs work correctly
  //
  const originalRowDataRef = useRef(rowData);
  const originalRowData = originalRowDataRef.current;

  // Column definitions & types
  const columnDefs = useColumnDefs(groupByCategory, editing);
  const columnTypes = useColumnTypes();

  // Row ID extractor
  const getRowId = useGetRowId();

  // Row‐selection config
  const rowSelection = useRowSelection(editing);

  // Auto‐group column definition
  const autoGroupColumnDef = useAutoGroupColumnDef();

  // Handle row selection changes
  const handleRowSelectionChange = useHandleRowSelectionChange(setSelectedRows);

  // Deselect all rows callback (no longer resets data)
  const handleDeselectAllRows = useHandleDeselectAllRows(
    setSelectedRows,
    gridRef
  );

  // When a single cell changes
  const handleCellValueChanged = useHandleCellValueChanged(
    originalRowData,
    setChangedRows
  );

  // Bulk‐update metadata callback
  const handleMetadataUpdate = useHandleMetadataUpdate(
    selectedRows,
    originalRowData,
    setRowData,
    setChangedRows,
    gridRef
  );

  const onRowClicked = useCallback((params) => {
    if (params.node.group) {
      params.node.setExpanded(!params.node.expanded);
    }
  }, []);

  const getRowStyle = useGetRowStyles();

  const onFirstDataRendered = useCallback((props) => {
    agApiSizeColumnsToFit(props);
  }, []);

  if (isEmpty(rowData)) {
    return null;
  }

  return (
    <Flx flexGrow={1} column gap={0} sx={{ overflowY: "auto" }}>
      <Flx fw jb ac>
        {isEmpty(selectedRows) ? null : (
          <BulkActionsToolbar
            selectedRows={selectedRows}
            onDeselectAllRows={handleDeselectAllRows}
            onMetadataUpdate={handleMetadataUpdate}
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
        <AgGridTableWrapper height="100%" simpleTable size={4}>
          <AgGridReact
            ref={gridRef}
            getRowId={getRowId}
            rowData={rowData}
            columnDefs={columnDefs}
            columnTypes={columnTypes}
            singleClickEdit
            quickFilterText={quickFilter}
            onFirstDataRendered={onFirstDataRendered}
            stopEditingWhenCellsLoseFocus
            onRowClicked={onRowClicked}
            autoGroupColumnDef={autoGroupColumnDef}
            onSelectionChanged={handleRowSelectionChange}
            onCellValueChanged={handleCellValueChanged}
            rowSelection={rowSelection}
            getRowStyle={getRowStyle}
            groupDisplayType={"groupRows"}
            domLayout={"autoHeight"}
          />
        </AgGridTableWrapper>
      </Flx>
    </Flx>
  );
};

const BulkActionsToolbar = ({
  selectedRows,
  onDeselectAllRows,
  onMetadataUpdate,
}) => {
  const [bulkFilename, setBulkFilename] = useState("");
  const [bulkDocGroup, setBulkDocGroup] = useState(null);
  const [bulkDocType, setBulkDocType] = useState(null);
  const [bulkEffectiveDate, setBulkEffectiveDate] = useState("");
  const [bulkNumExpirationDays, setBulkNumExpirationDays] = useState(null);

  // Whenever selection changes, populate if exactly one is selected; otherwise clear
  useEffect(() => {
    if (size(selectedRows) === 1) {
      const file = selectedRows[0];
      setBulkFilename(file.file_display_name || "");
      setBulkDocGroup(file.docGroup || null);
      setBulkDocType(file.docType || null);
      setBulkEffectiveDate(file.reportEffectiveDate || "");
      setBulkNumExpirationDays(file.reportGuidelineExpirationDays);
      return;
    }
    setBulkFilename("");
    setBulkDocGroup(null);
    setBulkDocType(null);
    setBulkEffectiveDate("");
    setBulkNumExpirationDays(null);
  }, [selectedRows]);

  if (isEmpty(selectedRows)) {
    return null;
  }

  // As soon as any bulk input changes, call onMetadataUpdate(...)
  const onFilenameChange = (txt) => {
    setBulkFilename(txt);
    onMetadataUpdate({ file_display_name: txt });
  };
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

  return (
    <Card
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        boxShadow:
          "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
        p: 1,
        borderRadius: "0px",
        zIndex: 11111,
        ".MuiSelect-select, .MuiInputBase-root,   label": {
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
          {/* <InputWrapper sx={{ minWidth: "280px" }} label="File Name">
            <TextInput
              value={bulkFilename}
              placeholder="File name"
              onChange={onFilenameChange}
            />
          </InputWrapper> */}

          <InputWrapper sx={{ minWidth: "280px" }} label="Category">
            <SelectInput
              value={bulkDocGroup}
              placeholder="Document Group"
              options={fileDocGroups}
              onChange={onGroupChange}
            />
          </InputWrapper>

          <InputWrapper label="Document Type" sx={{ minWidth: "280px" }}>
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
      </Flx>
    </Card>
  );
};

export default LoanFilesTable;
