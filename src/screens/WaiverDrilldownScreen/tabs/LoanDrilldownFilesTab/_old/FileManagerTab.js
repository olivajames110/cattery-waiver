import {
  DownloadOutlined,
  EditOutlined,
  FeedOutlined,
  FileUploadOutlined,
  SaveOutlined,
} from "@mui/icons-material";
import { Button, Divider, IconButton, Tooltip } from "@mui/material";
import { size } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Flx from "../../../../../components/layout/Flx";
import TitledHeaderWithSearch from "../../../../../components/layout/TitledHeaderWithSearch";
import { useLoanFilesHook } from "../../../../../hooks/useLoanFilesHook";
import { loanDrilldownSet } from "../../../../../redux/actions/loanDrilldownActions";
import { sidebarSetValues } from "../../../../../redux/actions/sidebarActions";
import LoanFileUploader from "../../../shared/LoanFileUploader";
import TableClickthroughSection from "../../../shared/TableClickthroughSection";
import LoanFileManagerTable from "../LoanFileManagerTable";

const FileManagerTab = ({}) => {
  const loanDrilldown = useSelector((state) => state?.loanDrilldown);

  const loanDocuments = useMemo(
    () => loanDrilldown?.loanDocuments || [],
    [loanDrilldown]
  );
  const { loading, updateLoanDocMetadata } = useLoanFilesHook();
  const ref = useRef();
  const navigate = useNavigate();
  // Our "source of truth" for row data:
  const [originalData, setOriginalData] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const dispatch = useDispatch();
  const [changedRows, setChangedRows] = useState([]);
  const [quickFilter, setQuickFilter] = useState(null);

  const [enhancedDetails, setEnhancedDetails] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleCellValueChanged = (params) => {
    const { data, column, newValue } = params;
    const rowId = data._id; // Or however you obtain the row's unique ID
    const fieldName = column.colId; // The field/column that changed
    let updatedFieldValue = newValue;
    const field = params?.colDef?.field;

    if (field === "file_display_name") {
      const originalExtension = data.name.split(".").pop().toLowerCase();
      const newValueWithoutExt = newValue.replace(/\.[^/.]+$/, "");
      updatedFieldValue = `${newValueWithoutExt}.${originalExtension}`;
    }

    setChangedRows((prev) => {
      const existingIndex = prev.findIndex((r) => r._id === rowId);
      if (existingIndex > -1) {
        const updatedChanges = [...prev];
        updatedChanges[existingIndex] = {
          ...updatedChanges[existingIndex],
          [fieldName]: updatedFieldValue,
        };
        return updatedChanges;
      } else {
        return [...prev, { _id: rowId, [fieldName]: updatedFieldValue }];
      }
    });

    setRowData((prev) =>
      prev.map((row) =>
        row._id === rowId ? { ...row, [fieldName]: updatedFieldValue } : row
      )
    );
  };

  const goToFileUpload = useCallback(() => {
    navigate(`/loan/${loanDrilldown?.loanNumber}/files/upload`);
  }, [navigate, loanDrilldown]);

  // Editing toggles
  const toggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const handleCancelEditing = () => {
    setEditing(false);
    setRowData(JSON.parse(JSON.stringify(originalData)));
    setChangedRows([]);
  };

  const onPreviewClick = (file) => {
    dispatch(
      sidebarSetValues({
        type: "filePreview",
        state: file,
      })
    );
  };

  const handleSaveChanges = () => {
    updateLoanDocMetadata({
      loanId: loanDrilldown?._id,
      data: changedRows,
      onSuccessFn: (data) => {
        dispatch(loanDrilldownSet(data));
        // onReset();
      },
    });
  };

  useEffect(() => {
    setOriginalData(JSON.parse(JSON.stringify(loanDocuments)));
    // setRowData(JSON.parse(JSON.stringify(loanDocuments)));
    setRowData(loanDocuments);
  }, [loanDocuments]);

  return (
    <>
      <TitledHeaderWithSearch
        title={`Loan Files ${size(loanDocuments)}`}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        endContent={
          <Flx gap={1}>
            <Button
              variant="outlined"
              startIcon={<FeedOutlined className="thin" />}
              onClick={() => setEnhancedDetails((prev) => !prev)}
            >
              {enhancedDetails
                ? "Hide Enhanced Details"
                : "Show Enhanced Details"}
            </Button>
            {editing ? (
              <Flx gap={1}>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleCancelEditing}
                >
                  Cancel Editing
                </Button>
                <Button
                  loading={loading}
                  onClick={handleSaveChanges}
                  startIcon={<SaveOutlined />}
                >
                  Save Changes
                </Button>
              </Flx>
            ) : (
              <Button
                variant="outlined"
                onClick={toggleEditing}
                startIcon={<EditOutlined />}
              >
                Edit Files
              </Button>
            )}

            <DownloadLoanFilesAsZipButton
              loanId={loanDrilldown?._id}
              loanNumber={loanDrilldown?.loanNumber}
            />

            <Divider orientation="vertical" flexItem />
            <Button
              // variant="outlined"
              onClick={() => setShowUpload(true)}
              startIcon={<FileUploadOutlined className="thin" />}
            >
              Upload Files
            </Button>
          </Flx>
        }
      >
        <LoanFileUploader
          show={showUpload}
          onClose={() => setShowUpload(false)}
        />
        <LoanFileManagerTable
          ref={ref}
          rowData={loanDocuments}
          editing={editing}
          onCellValueChanged={handleCellValueChanged}
          quickFilterText={quickFilter}
          setPreview={onPreviewClick}
          enhancedDetails={enhancedDetails}
        />
      </TitledHeaderWithSearch>
    </>
  );
  return (
    // <LoanDrilldownTabPanel value={"File Manager"} tab={tab}>
    <TableClickthroughSection
      title={"Loan Files"}
      quickFilter={quickFilter}
      setQuickFilter={setQuickFilter}
      endContent={
        <Flx gap={1}>
          <Button
            variant="outlined"
            startIcon={<FeedOutlined className="thin" />}
            onClick={() => setEnhancedDetails((prev) => !prev)}
          >
            {enhancedDetails
              ? "Hide Enhanced Details"
              : "Show Enhanced Details"}
          </Button>
          {editing ? (
            <Flx gap={1}>
              <Button
                variant="outlined"
                color="error"
                onClick={handleCancelEditing}
              >
                Cancel Editing
              </Button>
              <Button
                loading={loading}
                onClick={handleSaveChanges}
                startIcon={<SaveOutlined />}
              >
                Save Changes
              </Button>
            </Flx>
          ) : (
            <Button
              variant="outlined"
              onClick={toggleEditing}
              startIcon={<EditOutlined />}
            >
              Edit Files
            </Button>
          )}

          <DownloadLoanFilesAsZipButton
            loanId={loanDrilldown?._id}
            loanNumber={loanDrilldown?.loanNumber}
          />

          <Divider orientation="vertical" flexItem />
          <Button
            // variant="outlined"
            onClick={goToFileUpload}
            startIcon={<FileUploadOutlined className="thin" />}
          >
            Upload Files
          </Button>
        </Flx>
      }
    >
      <LoanFileManagerTable
        ref={ref}
        rowData={rowData}
        editing={editing}
        onCellValueChanged={handleCellValueChanged}
        quickFilterText={quickFilter}
        setPreview={onPreviewClick}
        enhancedDetails={enhancedDetails}
      />
    </TableClickthroughSection>
    // </LoanDrilldownTabPanel>
  );
};

const DownloadLoanFilesAsZipButton = ({ loanId, loanNumber, icon }) => {
  const { loading, downloadLoanDocs } = useLoanFilesHook();

  const onDownloadClick = () => {
    downloadLoanDocs({
      loanId: loanId,
      fileDownloadName: `Loan ${loanNumber} Files`,
    });
  };

  if (icon) {
    return (
      <Tooltip title="Download Loan Files as ZIP">
        <IconButton
          loading={loading}
          onClick={onDownloadClick}
          size="small"
          color="primary"
        >
          <DownloadOutlined className="thin-7" sx={{ fontSize: 24 }} />
        </IconButton>
      </Tooltip>
    );
  }

  return (
    <Button
      loading={loading}
      variant="outlined"
      onClick={onDownloadClick}
      startIcon={<DownloadOutlined className="thin" />}
    >
      Download Files
    </Button>
  );
};
export default FileManagerTab;
