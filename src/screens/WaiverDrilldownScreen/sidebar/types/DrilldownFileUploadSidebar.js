import { Button, Divider } from "@mui/material";
import { isEmpty, size } from "lodash";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import Flx from "../../../../components/layout/Flx";
import { useLoanFilesHook } from "../../../../hooks/useLoanFilesHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import DrilldownSidebarPane from "../DrilldownSidebarPane";

import { AgGridReact } from "ag-grid-react";
import AgGridTableWrapper from "../../../../components/agGrid/AgGridTableWrapper";
import SelectInput from "../../../../components/inputs/SelectInput";
import {
  fileDocGroups,
  getDocTypesByGroup,
} from "../../../../config/fileDocGroupAndTypes";
import { sidebarClear } from "../../../../redux/actions/sidebarActions";
import { useNavigate } from "react-router-dom";

const DrilldownFileUploadSidebar = memo(() => {
  const filesList = useSelector((state) => state.sidebar?.state);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  const onFilesReset = () => {
    dispatch(sidebarClear());
    navigate(`/loan/${loanDrilldown?.loanNumber}`);
  };

  return (
    <>
      <DrilldownSidebarPane
        title="Files To Upload"
        initialWidth="880px"
        bodyOverflow="hidden"
      >
        <UploadLoanFilesRenderer onReset={onFilesReset} files={filesList} />
      </DrilldownSidebarPane>
    </>
  );
});

const UploadLoanFilesRenderer = ({ files, onReset }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const ref = useRef();
  // console.log("files", files);
  const [selectedRows, setSelectedRows] = useState(null);
  const [rowData, setRowData] = useState(files);

  const { loading, uploadLoanDocs } = useLoanFilesHook();
  const dispatch = useDispatch();

  const handleUploadFiles = () => {
    // console.log("files", rowData);
    // return;
    uploadLoanDocs({
      loanId: loanDrilldown?._id,
      files: rowData,
      onSuccessMsg:
        size(rowData) > 1
          ? `${size(rowData)} files uploaded successfully`
          : "File uploaded successfully",
      onSuccessFn: (data) => {
        dispatch(loanDrilldownSet(data));
        onReset();
      },
    });
  };

  // Function to handle row deletion
  const handleDeleteRow = useCallback((rowIndex) => {
    setRowData((prevRowData) => {
      const newRowData = [...prevRowData];
      newRowData.splice(rowIndex, 1);
      return newRowData;
    });
  }, []);

  const handleSelectionChanged = useCallback((params) => {
    const selected = params.api.getSelectedRows();
    setSelectedRows(selected);
  }, []);

  // Handle deleting the selected rows
  const handleDeleteSelectedRows = useCallback(() => {
    setRowData((prev) => prev.filter((row) => !selectedRows.includes(row)));
    // Clear selection
    setSelectedRows([]);
  }, [selectedRows]);

  const handleCellValueChanged = useCallback(
    (params) => {
      const { colDef, data, newValue } = params;
      // console.log("CHNGE", params);
      // If the user changes the filename
      if (colDef.field === "file_display_name") {
        // Pull the real extension from `data.name`
        const originalExtension = data.name.split(".").pop().toLowerCase();
        // Remove any extension from the user’s typed value
        const newValueWithoutExt = newValue.replace(/\.[^/.]+$/, "");
        // Re-append original extension
        data.file_display_name = `${newValueWithoutExt}.${originalExtension}`;

        setRowData((prev) =>
          prev.map((item) => (item.id === data.id ? { ...data } : item))
        );
      }

      // If the user changes docGroup
      if (colDef.field === "docGroup") {
        data.docGroup = newValue;
        // If there's already a docType, remove it
        if (data.docType) {
          data.docType = "";
        }
        setRowData((prev) =>
          prev.map((item) => (item.id === data.id ? { ...data } : item))
        );
      }

      setTimeout(() => {
        if (ref.current && ref.current.api) {
          ref.current.api.refreshCells();
        }
      }, 0);
    },
    [setRowData]
  );

  const updateDocumentMetadata = useCallback(
    ({ newDocGroup, newDocType }) => {
      // console.log("Updating document metadata:", {
      //   newDocGroup,
      //   newDocType,
      //   selectedRows: selectedRows?.length,
      // });

      if (!selectedRows || selectedRows.length === 0) return;

      // Get IDs of selected rows for faster lookup
      const selectedRowIds = selectedRows.map((row) => row.id);

      setRowData((prev) => {
        // Create a new array to ensure state change is detected
        const updatedRows = [...prev];

        // Find and update only the selected rows by ID
        selectedRowIds.forEach((id) => {
          const index = updatedRows.findIndex((row) => row.id === id);
          if (index !== -1) {
            const rowToUpdate = updatedRows[index];
            const updatedRow = { ...rowToUpdate };

            // Update docGroup if provided
            if (newDocGroup !== undefined) {
              updatedRow.docGroup = newDocGroup;
              // Clear docType when docGroup changes
              updatedRow.docType = "";
            }

            // Update docType if provided and not changing docGroup
            if (newDocType !== undefined && newDocGroup === undefined) {
              updatedRow.docType = newDocType || "";
            }

            // console.log(`Updating row ${id}:`, updatedRow);
            updatedRows[index] = updatedRow;
          }
        });

        return updatedRows;
      });

      // Optional: Force refresh the grid
      setTimeout(() => {
        if (ref.current && ref.current.api) {
          ref.current.api.refreshCells();
        }
      }, 0);
    },
    [selectedRows, setRowData]
  );

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Filename",
        field: "file_display_name",
        flex: 1,
        minWidth: 250,
        // width: 180,
        cellEditor: "agTextCellEditor",
        editable: true,
        checkbox: true,
      },
      {
        headerName: "File Group",
        field: "docGroup",
        editable: true,
        flex: 1,
        maxWidth: 400,
        minWidth: 200,
        // minWidth: 160,
        // width: 260,
        cellEditor: "agRichSelectCellEditor",
        cellEditorPopup: true, // Enable popup mode for the dropdown
        cellEditorParams: {
          values: fileDocGroups || [], // Replace with your actual values
        },
      },
      {
        headerName: "File Group Type",
        field: "docType",
        editable: true,
        flex: 1,

        minWidth: 200,
        maxWidth: 400,

        cellEditor: "agRichSelectCellEditor",
        cellEditorPopup: true, // Enable popup mode for the dropdown
        cellEditorParams: (params) => {
          return {
            values: getDocTypesByGroup(params.data.docGroup || "Appraisal"),
          };
        },
      },
      {
        field: "file.type",
        headerName: "Size",
        editable: false,

        width: 120,
      },
      {
        field: "file.size",
        headerName: "Size",
        editable: false,

        cellRenderer: (params) => {
          if (params.node.group) {
            return "";
          }
          const mb = (params.value || 0) / 1024 / 1024;
          return mb.toFixed(2) + " MB";
        },
        width: 100,
      },
    ],
    [handleDeleteRow]
  );

  useEffect(() => {
    setRowData(files);
  }, [files]);

  if (isEmpty(files)) {
    return null;
  }
  return (
    <Flx
      column
      sx={{
        overflow: "hidden",
        flexGrow: 1,
        gap: 2,
        // mt: 2,
      }}
    >
      <AgGridTableWrapper
        height="100%"
        showOnlyTopBorder
        suppressBorderRadius
        size={4}
      >
        <AgGridReact
          ref={ref}
          getRowId={(params) => params.data.id}
          rowData={rowData}
          columnDefs={columnDefs}
          singleClickEdit
          onSelectionChanged={handleSelectionChanged}
          domLayout={"autoHeight"}
          onCellValueChanged={handleCellValueChanged}
          stopEditingWhenCellsLoseFocus
          popupParent={document.body}
          rowSelection={{
            mode: "multiRow",
          }}
        />
      </AgGridTableWrapper>

      {!isEmpty(selectedRows) ? (
        <BulkActions
          selectedRows={selectedRows}
          onRowDeleteClick={handleDeleteSelectedRows}
          updateDocumentMetadata={updateDocumentMetadata}
        />
      ) : (
        <Flx end flexGrow={1} gap={1}>
          <Button onClick={onReset} variant="outlined" size="medium">
            Clear Files
          </Button>
          <Button size="medium" onClick={handleUploadFiles} loading={loading}>
            Save & Upload
          </Button>
        </Flx>
      )}

      {/* <Flx
        fw
        jb
        ac
        //
        // end={!isEmpty(selectedRows)}
        gap={4}
        wrap
      >
        {!isEmpty(selectedRows) ? (
          <BulkActions
            selectedRows={selectedRows}
            onRowDeleteClick={handleDeleteSelectedRows}
            updateDocumentMetadata={updateDocumentMetadata}
          />
        ) : (
          <Flx end flexGrow={1} gap={1}>
            <Button onClick={onReset} variant="outlined" size="medium">
              Clear Files
            </Button>
            <Button size="medium" onClick={handleUploadFiles} loading={loading}>
              Save & Upload
            </Button>
          </Flx>
        )}
      </Flx> */}
    </Flx>
  );
};

const BulkActions = ({
  selectedRows,
  onRowDeleteClick,

  updateDocumentMetadata,
}) => {
  const [bulkDocGroup, setBulkDocGroup] = useState(null);
  const [bulkDocType, setBulkDocType] = useState(null);

  const onGroupChange = (group) => {
    setBulkDocGroup(group);
    // onDocGroupChange(group);
    updateDocumentMetadata({ newDocGroup: group });
  };

  const onTypeChange = (type) => {
    setBulkDocType(type);
    updateDocumentMetadata({ newDocType: type });
    // onDocTypeChange(type); // Make sure 'type' is a valid string here
  };

  useEffect(() => {
    if (isEmpty(selectedRows)) {
      setBulkDocGroup(null);
      setBulkDocType(null);
    }
  }, [selectedRows]);

  if (isEmpty(selectedRows)) {
    return null;
  }
  return (
    <Flx fw flexGrow={1} gap={1}>
      <Button
        onClick={onRowDeleteClick}
        color="error"
        variant="outlined"
        size="small"
      >
        Delete Rows ({size(selectedRows)})
      </Button>
      <Divider orientation="vertical" flexItem />
      <SelectInput
        value={bulkDocGroup}
        fullWidth
        placeholder="Doc Group"
        options={fileDocGroups}
        onChange={onGroupChange}
      />
      <SelectInput
        fullWidth
        value={bulkDocType}
        placeholder="Doc Type"
        options={getDocTypesByGroup(bulkDocGroup) || []}
        onChange={onTypeChange}
      />
    </Flx>
  );
};
export default DrilldownFileUploadSidebar;
