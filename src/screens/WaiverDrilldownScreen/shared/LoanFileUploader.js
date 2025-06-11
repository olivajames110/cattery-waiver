import {
  Box,
  Button,
  Card,
  Checkbox,
  FormControlLabel,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import { isEmpty, isNil, size } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUploadField from "../../../components/inputs/FileUploadField";
import Flx from "../../../components/layout/Flx";
import BasicModal from "../../../components/modals/BasicModal";
import Htag from "../../../components/typography/Htag";

import {
  CloseOutlined,
  DeleteOutlineOutlined,
  SyncRounded,
} from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { AgGridReact } from "ag-grid-react";
import NumberInput from "../../../_src_shared/components/inputs/NumberInput";
import { columnTypesDate } from "../../../_src_shared/utils/agGrid/columnTypes/columnTypesDate";
import { columnTypesNumber } from "../../../_src_shared/utils/agGrid/columnTypes/columnTypesNumber";
import AgGridTableWrapper from "../../../components/agGrid/AgGridTableWrapper";
import DateInput from "../../../components/inputs/DateInput";
import SelectInput from "../../../components/inputs/SelectInput";
import InputWrapper from "../../../components/inputs/shared/InputWrapper";
import TabPanel from "../../../components/navigation/TabPanel";
import ToggleTabSwitcher from "../../../components/navigation/ToggleTabSwitcher";
import Txt from "../../../components/typography/Txt";
import {
  fileDocGroupAndTypes,
  fileDocGroups,
  getDocTypesByGroup,
  searchDocuments,
} from "../../../config/fileDocGroupAndTypes";
import { useLoanFilesHook } from "../../../hooks/useLoanFilesHook";
import { loanDrilldownSet } from "../../../redux/actions/loanDrilldownActions";

import SearchInput from "../../../components/inputs/SearchInput";
import SelectToggleInput from "../../../components/inputs/SelectToggleInput";
import LoanDocumentGroupIcon from "./LoanDocumentGroupIcon";

const tabEnums = {
  BASIC_UPLOAD: "Basic Upload",
  CATEGORIZED_DOCUMENT_GROUPS: "Upload By Document Category",
};

const LoanFileUploader = ({
  show,
  onClose,
  defaultDocGroup,
  defaultDocType,
}) => {
  const [filesList, setFilesList] = useState(null);
  const [docGroup, setDocGroup] = useState(defaultDocGroup);
  const [docType, setDocType] = useState(defaultDocType);
  const [uploadType, setUploadType] = useState(tabEnums.BASIC_UPLOAD);

  const onClearFiles = () => {
    setFilesList(null);
    setDocGroup(null);
    setDocType(null);
  };

  const onModalClose = useCallback((props) => {
    setFilesList(null);
    setDocGroup(null);
    setDocType(null);
    setUploadType(tabEnums.BASIC_UPLOAD);
    onClose(false);
  }, []);

  const updateFilesMetadata = (files, docGroup, docType) => {
    // Guard clause for empty files array
    if (!files || files.length === 0) {
      return [];
    }

    // Create a new array with updated metadata
    return files.map((file) => {
      // Create a copy of the file to avoid mutating the original
      const updatedFile = { ...file };

      // Update docGroup if provided
      if (docGroup !== undefined && docGroup !== null) {
        updatedFile.docGroup = docGroup;

        // Clear docType if docGroup changes and the types don't match
        // This assumes docType is dependent on docGroup
        if (updatedFile.docType && docType === undefined) {
          updatedFile.docType = "";
        }
      }

      // Update docType if provided
      if (docType !== undefined && docType !== null) {
        updatedFile.docType = docType;
      }

      return updatedFile;
    });
  };

  const onFilesAdded = useCallback(
    (newFiles, docGroup, docType) => {
      let updatedFiles = updateFilesMetadata(newFiles, docGroup, docType);
      if (isEmpty(filesList)) {
        setFilesList(updatedFiles);
        return;
      }

      setFilesList([...filesList, ...updatedFiles]);
    },
    [filesList]
  );

  const onDocGroupTypeReset = useCallback((props) => {
    setDocGroup(null);
    setDocType(null);
  }, []);

  const modalMaxWidth = useMemo(() => {
    if (uploadType === tabEnums.CATEGORIZED_DOCUMENT_GROUPS) {
      return "xl";
    }

    if (!isEmpty(filesList)) {
      return "lg";
    }
    return "lg";
  }, [uploadType, filesList]);
  return (
    <BasicModal
      allowFullScreen
      title={"Upload Loan Documents"}
      show={show}
      onClose={onModalClose}
      maxWidth={modalMaxWidth}
      bodySx={{
        p: 3,
        pt: 0,
        ".MuiSelect-select": {
          fontSize: "12px",
        },
      }}
    >
      <ToggleTabSwitcher
        value={uploadType}
        variant={"underline"}
        onChange={setUploadType}
        sx={{ ml: -2, mb: 3 }}
        tabs={[tabEnums.BASIC_UPLOAD, tabEnums.CATEGORIZED_DOCUMENT_GROUPS]}
      />
      <TabPanel value={uploadType} tabValue={tabEnums.BASIC_UPLOAD}>
        <TablPanelBasicFileUpload
          docGroup={docGroup}
          docType={docType}
          setDocGroup={setDocGroup}
          onDocGroupTypeReset={onDocGroupTypeReset}
          setDocType={setDocType}
          onFilesAdded={onFilesAdded}
        />
      </TabPanel>
      <TabPanel
        value={uploadType}
        tabValue={tabEnums.CATEGORIZED_DOCUMENT_GROUPS}
      >
        <TablPanelDocGroupUpload
          filesEmpty={isEmpty(filesList)}
          onFilesAdded={onFilesAdded}
        />
      </TabPanel>

      <UploadedFilesContent
        onClearFiles={onClearFiles}
        files={filesList}
        onModalClose={onModalClose}
      />
    </BasicModal>
  );
};

/**
 * TAB PANEL --- GENERAL UPLOAD
 */

const TablPanelBasicFileUpload = ({
  docType,
  docGroup,
  setDocGroup,
  setDocType,
  onDocGroupTypeReset,
  onFilesAdded,
}) => {
  const fileUploadLabel = useMemo(() => {
    if (isNil(docGroup) && isNil(docType)) {
      return "Drag & Drop Files Here";
    }

    if (!isNil(docGroup) && isNil(docType)) {
      return `Drag & Drop ${docGroup} Files Here`;
    }

    if (!isNil(docGroup) && !isNil(docType)) {
      return `Drag & Drop ${docType} Files Here`;
    }

    return `Drag & Drop Files Here`;
  }, [docGroup, docType]);
  return (
    <Flx column gap={1}>
      <Flx fw jb ac sx={{ position: "relative" }}>
        <Htag h4 sx={{ fontWeight: 500 }}>
          Assign & Upload Files
        </Htag>
        {isNil(docGroup) && isNil(docType) ? null : (
          <Tooltip title="Reset Document Category and Type" disableInteractive>
            <IconButton
              size="small"
              onClick={onDocGroupTypeReset}
              sx={{ position: "absolute", right: 0, top: -10 }}
            >
              <SyncRounded className="thin" />
            </IconButton>
          </Tooltip>
        )}
      </Flx>
      <Card
        sx={{
          p: 3,
          display: "flex",
          flexWrap: "wrap",
          gap: 7,

          ".MuiFormLabel-root": {
            color: grey[900],
          },
        }}
      >
        <DocGroupAndTypeSelectorContent
          docGroup={docGroup}
          docType={docType}
          onDocGroupChange={setDocGroup}
          onDocTypeChange={setDocType}
          onResetUploadGroups={onDocGroupTypeReset}
          sx={{ width: "320px" }}
        />
        <InputWrapper
          label={fileUploadLabel}
          sx={{
            flexShrink: 0,
            flexBasis: "340px",
            flexGrow: 1,
            height: "auto",
          }}
        >
          <FileUploadField
            onFilesAdded={(f) => onFilesAdded(f, docGroup, docType)}
            suppressGrid
            background={grey[50]}
            suppressFileList
            minHeight="155px"
            suppressUploadButton
            sx={{
              flexGrow: 1,
            }}
          />
        </InputWrapper>
      </Card>
    </Flx>
  );
};

const DocGroupAndTypeSelectorContent = ({
  docGroup,
  docType,
  onDocGroupChange,
  hideLabel,

  onDocTypeChange,
}) => {
  return (
    <Box
      sx={{
        position: "relative",
        flexGrow: 1,
        flexBasis: "620px",
        flexShrink: 0,
      }}
    >
      <Flx column gap={6}>
        <InputWrapper
          label={hideLabel ? null : "Document Category"}
          sx={{
            ".MuiButtonBase-root": { padding: "1px 6px", fontSize: "12px" },
          }}
        >
          <SelectToggleInput
            value={docGroup}
            options={fileDocGroups}
            onChange={onDocGroupChange}
          />
        </InputWrapper>

        <InputWrapper label={hideLabel ? null : "Document Type"}>
          {isNil(docGroup) ? (
            <Flx ac sx={{ height: "38px" }}>
              <Txt
                sx={{ opacity: 0.35, fontStyle: "italic", fontSize: "12px" }}
              >
                Document Category Required
              </Txt>
            </Flx>
          ) : (
            <SelectInput
              value={docType}
              placeholder="Document Category Type"
              options={getDocTypesByGroup(docGroup) || []}
              onChange={onDocTypeChange}
            />
          )}
        </InputWrapper>
      </Flx>
    </Box>
  );
};

/**
 * TAB PANEL --- UPLOAD BY DOCUMENT GROUP
 */

const TablPanelDocGroupUpload = ({ filesEmpty, onFilesAdded }) => {
  const [quickFilter, setQuickFilter] = useState(null);
  const [showTypes, setShowTypes] = useState(true);
  const theme = useTheme();
  const filteredGroupsAndTypes = useMemo(() => {
    if (isNil(quickFilter) || quickFilter === "" || quickFilter === " ") {
      return Object.keys(fileDocGroupAndTypes);
    }

    return Object.keys(searchDocuments(quickFilter));
  }, [quickFilter]);

  return (
    <Flx flexGrow={1} column gap={1}>
      <Htag h4 sx={{ fontWeight: 500 }}>
        Drag & Drop By Category or Type
      </Htag>

      <Flx
        wrap
        g={showTypes ? 2.5 : 1}
        sx={{
          flexGrow: 1,
          background: grey[100],
          overflowY: "auto",
          maxHeight: filesEmpty ? "unset" : "55vh",
          p: 2,
          borderRadius: 1,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Flx fw jb ac>
          <SearchInput
            value={quickFilter}
            onChange={setQuickFilter}
            placeholder={"Search for document group or type..."}
            sx={{
              background: "#ffffff",
              minWidth: "420px",
            }}
          />
          <FormControlLabel
            label="Show Document Types"
            sx={{ flexShrink: 0, span: { fontSize: "12px" } }}
            control={
              <Checkbox
                size="small"
                checked={showTypes}
                onChange={(e) => setShowTypes(e.target.checked)}
              />
            }
          />
        </Flx>
        {filteredGroupsAndTypes.map((group) => {
          return (
            <DocGroupFileUpload
              docGroup={group}
              docType={null}
              onFilesAdded={onFilesAdded}
              showTypes={showTypes}
            />
          );
        })}
      </Flx>
    </Flx>
  );
};

const DocGroupFileUpload = ({ onFilesAdded, docGroup, docType, showTypes }) => {
  const docGroupTypes = useMemo(() => getDocTypesByGroup(docGroup), [docGroup]);

  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        flexBasis: "240px",
        flexGrow: 1,
        background: "#ffffff",
        p: 1,
        gap: 0.5,
        flexShrink: 0,
      }}
    >
      <Flx column gap={0.5}>
        <Flx ac gap={0.5} sx={{ py: 0.4, svg: { fontSize: "16px" } }}>
          <LoanDocumentGroupIcon docGroup={docGroup} />

          <Txt color={grey[600]} fontSize="11px" sx={{ fontWeight: 600 }}>
            {docGroup}
          </Txt>
        </Flx>

        <FileUploadField
          onFilesAdded={(f) => onFilesAdded(f, docGroup, null)}
          suppressGrid
          docType={docType}
          docGroup={docGroup}
          borderSize={1}
          sx={{
            borderBottom: "none",
            flexShrink: 0,
          }}
          background={"#ffffff"}
          suppressFileList
          minHeight="54px"
          // minHeight="82px"
          suppressLabel
          // uploadText={docGroup}
          suppressUploadButton
        />
      </Flx>

      {showTypes ? (
        <Flx wrap g={0.5} sx={{ flexGrow: 1 }}>
          {docGroupTypes.map((type) => {
            return (
              <DocTypeFileUpload
                docGroup={docGroup}
                docType={type}
                onFilesAdded={onFilesAdded}
              />
            );
          })}
        </Flx>
      ) : null}
    </Card>
  );
};

const DocTypeFileUpload = ({ onFilesAdded, docGroup, docType }) => {
  return (
    <FileUploadField
      onFilesAdded={(f) => onFilesAdded(f, docGroup, docType)}
      suppressGrid
      docType={docType}
      hideUploadButton
      borderSize={1}
      docGroup={docGroup}
      background={"#ffffff"}
      sx={{
        flexGrow: 1,
        flexBasis: "120px",
        p: 0.5,
        ".upload-text-label": { color: grey[800], fontSize: "11px" },
      }}
      suppressFileList
      minHeight="26px"
      uploadText={docType}
      suppressUploadButton
    />
  );
};

/**
 * SHARED COMPONENTS
 */

const UploadedFilesContent = ({ files, onClearFiles, onModalClose }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const ref = useRef();

  const modalContentRef = useRef(null);

  const [selectedRows, setSelectedRows] = useState(null);
  const [rowData, setRowData] = useState(files);

  const { loading, uploadLoanDocs } = useLoanFilesHook();
  const dispatch = useDispatch();

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Filename",
        field: "file_display_name",
        flex: 1,
        minWidth: 250,
        cellEditor: "agTextCellEditor",
        editable: true,
        checkbox: true,
      },
      {
        headerName: "Document Group",
        field: "docGroup",
        editable: true,
        width: 220,
        cellEditor: "agRichSelectCellEditor",
        cellEditorPopup: true, // Enable popup mode for the dropdown
        cellEditorParams: {
          values: fileDocGroups || [], // Replace with your actual values
        },
      },
      {
        headerName: "Document Type",
        field: "docType",
        editable: true,
        width: 220,
        cellEditor: "agRichSelectCellEditor",
        cellEditorPopup: true, // Enable popup mode for the dropdown
        cellEditorParams: (params) => {
          return {
            values: getDocTypesByGroup(params.data.docGroup || "Appraisal"),
          };
        },
      },
      {
        headerName: "Report Effective Date",
        field: "reportEffectiveDate",
        editable: true,
        type: "date",
        width: 160,
        wrapHeaderText: true, // Wrap Column Group Header
        autoHeaderHeight: true,
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
      },
      {
        headerName: "Report Guideline Expiration Days",
        field: "reportGuidelineExpirationDays",
        editable: true,
        type: "number",
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
        wrapHeaderText: true, // Wrap Column Group Header
        autoHeaderHeight: true,
        width: 140,
      },
    ],
    []
  );

  const onClearFilesClick = useCallback((props) => {
    setSelectedRows(null);
    setRowData(null);
    onClearFiles();
  }, []);

  const handleUploadFiles = () => {
    uploadLoanDocs({
      loanId: loanDrilldown?._id,
      files: rowData,
      onSuccessMsg:
        size(rowData) > 1
          ? `${size(rowData)} files uploaded successfully`
          : "File uploaded successfully",
      onSuccessFn: (data) => {
        dispatch(loanDrilldownSet(data));
        // dispatch(loanDrilldownSet(data));
        onClearFilesClick();
        onModalClose();
      },
    });
  };

  const handleRowSelectionChange = useCallback((params) => {
    const selected = params.api.getSelectedRows();
    setSelectedRows(selected);
  }, []);

  // Handle deleting the selected rows
  // inside UploadedFilesContent…
  const handleDeleteSelectedRows = useCallback(() => {
    if (!selectedRows || selectedRows.length === 0) return;

    // pull out the IDs of whatever is selected
    const selectedIds = selectedRows.map((r) => r.id);

    // drop any rows whose id is in that list
    setRowData((prev) => prev.filter((row) => !selectedIds.includes(row.id)));

    // also clear AG-Grid's built-in selection
    if (ref.current && ref.current.api) {
      ref.current.api.deselectAll();
    }

    // mirror that in React state
    setSelectedRows([]);
  }, [selectedRows]);

  const handleDeselectAllRows = useCallback(() => {
    // ask AG-Grid to drop its selection
    if (ref.current && ref.current.api) {
      ref.current.api.deselectAll();
    }
    // mirror that in React state
    setSelectedRows([]);
  }, []);

  const handleCellValueChanged = useCallback(
    (params) => {
      const { colDef, data, newValue } = params;

      // If the user changes the filename
      if (colDef.field === "file_display_name") {
        // Pull the real extension from `data.name`
        const originalExtension = data.name.split(".").pop().toLowerCase();
        // Remove any extension from the user's typed value
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

      // If the user changes date values, ensure they're stored as ISO strings
      if (colDef.field === "reportEffectiveDate") {
        // Ensure the value is an ISO string
        if (newValue instanceof Date) {
          data.reportEffectiveDate = newValue.toISOString();
        } else if (typeof newValue === "string" && newValue) {
          // If it's already a string but not an ISO string, convert it
          if (!newValue.includes("T") || !newValue.endsWith("Z")) {
            const dateObj = new Date(newValue);
            if (!isNaN(dateObj.getTime())) {
              data.reportEffectiveDate = dateObj.toISOString();
            }
          }
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

  const handleMetadataUpdate = useCallback(
    ({
      newDocGroup,
      newDocType,
      newEffectiveDate,
      newGuidelineExpirationDays,
    }) => {
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

            // Ensure date is stored as ISO string
            if (newEffectiveDate !== undefined) {
              if (newEffectiveDate instanceof Date) {
                updatedRow.reportEffectiveDate = newEffectiveDate.toISOString();
              } else {
                updatedRow.reportEffectiveDate = newEffectiveDate;
              }
            }

            if (newGuidelineExpirationDays !== undefined) {
              updatedRow.reportGuidelineExpirationDays =
                newGuidelineExpirationDays;
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

  const columnTypes = useMemo(() => {
    return {
      ...columnTypesDate(),
      ...columnTypesNumber(),
    };
  }, []);

  useEffect(() => {
    setRowData(files);
  }, [files]);

  if (isEmpty(files)) {
    return null;
  }
  return (
    <Flx flexGrow={1} column gap={1} sx={{ mt: 6 }}>
      <Htag h4 sx={{ fontWeight: 500 }}>
        Added Files ({size(rowData)})
      </Htag>
      <Flx fw jb ac>
        {isEmpty(selectedRows) ? null : (
          <BulkActionsToolbar
            selectedRows={selectedRows}
            onDeleteSelectedRows={handleDeleteSelectedRows}
            onMetadataUpdate={handleMetadataUpdate}
            onDeselectAllRows={handleDeselectAllRows}
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
              ref={ref}
              getRowId={(params) => params.data.id}
              rowData={rowData}
              columnDefs={columnDefs}
              singleClickEdit
              columnTypes={columnTypes}
              onSelectionChanged={handleRowSelectionChange}
              domLayout={"autoHeight"}
              onCellValueChanged={handleCellValueChanged}
              stopEditingWhenCellsLoseFocus
              popupParent={modalContentRef.current}
              rowSelection={{
                mode: "multiRow",
              }}
            />
          </AgGridTableWrapper>
        </div>
        <Flx fw jb ac>
          <Flx end flexGrow={1} gap={1}>
            <Button
              onClick={onClearFilesClick}
              variant="outlined"
              size="medium"
            >
              Clear Files
            </Button>
            <Button size="medium" onClick={handleUploadFiles} loading={loading}>
              Save & Upload
            </Button>
          </Flx>
        </Flx>
      </Flx>
    </Flx>
  );
};

const BulkActionsToolbar = ({
  selectedRows,
  onDeselectAllRows,
  onDeleteSelectedRows,
  onMetadataUpdate,
}) => {
  const [bulkDocGroup, setBulkDocGroup] = useState(null);
  const [bulkDocType, setBulkDocType] = useState(null);
  const [bulkEffectiveDate, setBulkEffectiveDate] = useState("");
  const [bulkNumExpirationDays, setBulkNumExpirationDays] = useState(null);

  const onGroupChange = (group) => {
    setBulkDocGroup(group);
    onMetadataUpdate({ newDocGroup: group });
  };

  const onTypeChange = (type) => {
    setBulkDocType(type);
    onMetadataUpdate({ newDocType: type });
  };

  const onEffectiveDateChange = (date) => {
    setBulkNumExpirationDays(date);
    onMetadataUpdate({ newEffectiveDate: date });
  };

  const onNumExpirationDaysChange = (num) => {
    setBulkNumExpirationDays(num);
    onMetadataUpdate({ newGuidelineExpirationDays: num });
  };

  useEffect(() => {
    if (isEmpty(selectedRows)) {
      setBulkDocGroup(null);
      setBulkDocType(null);
      setBulkEffectiveDate(null);
    }
  }, [selectedRows]);

  if (isEmpty(selectedRows)) {
    return null;
  }
  return (
    <Flx
      fw
      jb
      ac
      sx={{
        background: grey[100],
        position: "sticky",
        top: "-8px",
        left: "0",
        borderRadius: 3,
        zIndex: "1111",
        ".MuiSelect-select, .MuiInputBase-root, .txt": {
          fontSize: "12px",
        },
      }}
    >
      <PseudoColumn center width="52px">
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
      </PseudoColumn>
      <PseudoColumn sx={{ alignItems: "center", pl: 1.5 }} grow={1} gap={1}>
        <Txt sx={{ lineHeight: "normal" }} bold>
          {`Selected Rows (${size(selectedRows)})`}
        </Txt>
        <Tooltip
          title={
            size(selectedRows) === 1
              ? "Delete File"
              : `Delete ${size(selectedRows)} Files`
          }
          disableInteractive
        >
          <IconButton
            onClick={onDeleteSelectedRows}
            color="error"
            variant="outlined"
            size="small"
          >
            <DeleteOutlineOutlined className="thin" />
          </IconButton>
        </Tooltip>
      </PseudoColumn>
      <PseudoColumn width="220px">
        <SelectInput
          value={bulkDocGroup}
          placeholder="Document Group"
          options={fileDocGroups}
          onChange={onGroupChange}
        />
      </PseudoColumn>
      <PseudoColumn width="220px">
        {isNil(bulkDocGroup) ? (
          <Flx ac sx={{ height: "38px" }}>
            <Txt sx={{ opacity: 0.35, fontStyle: "italic", fontSize: "12px" }}>
              Document Group Required
            </Txt>
          </Flx>
        ) : (
          <SelectInput
            value={bulkDocType}
            placeholder="Document Type"
            options={getDocTypesByGroup(bulkDocGroup) || []}
            onChange={onTypeChange}
          />
        )}
      </PseudoColumn>
      <PseudoColumn width="160px">
        <DateInput
          value={bulkEffectiveDate}
          placeholder="Effective Date"
          onChange={onEffectiveDateChange}
        />
      </PseudoColumn>
      <PseudoColumn center width="140px">
        <Tooltip
          title={
            size(selectedRows) === 1
              ? "Delete File"
              : `Delete ${size(selectedRows)} Files`
          }
          disableInteractive
        >
          <NumberInput
            value={bulkNumExpirationDays}
            placeholder="Exp. Days"
            onChange={onNumExpirationDaysChange}
          />
        </Tooltip>
      </PseudoColumn>
    </Flx>
  );
};

const PseudoColumn = ({ sx, center, grow = 0, gap, width, children }) => (
  <Flx
    center={center}
    flexShrink={0}
    gap={gap}
    flexGrow={grow}
    sx={{
      width: width,
      flexBasis: width,
      px: 1,
      py: 1,
      ...sx,
    }}
  >
    {children}
  </Flx>
);
export default LoanFileUploader;
