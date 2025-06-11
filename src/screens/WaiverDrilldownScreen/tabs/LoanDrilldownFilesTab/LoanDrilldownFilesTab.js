import {
  AccountTreeOutlined,
  CancelRounded,
  DownloadOutlined,
  EditOutlined,
  FileUploadOutlined,
  SaveOutlined,
  ViewListOutlined,
  VisibilityOffOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  IconButton,
  LinearProgress,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import { green, grey } from "@mui/material/colors";
import { isEmpty, size } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import FlxGrid from "../../../../_src_shared/components/layout/FlxGrid";
import SearchInput from "../../../../components/inputs/SearchInput";
import Flx from "../../../../components/layout/Flx";
import ScreenContent from "../../../../components/layout/ScreenContent";
import Txt from "../../../../components/typography/Txt";
import { useLoanFilesHook } from "../../../../hooks/useLoanFilesHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import LoanDocumentGroupIcon from "../../shared/LoanDocumentGroupIcon";
import LoanFileUploader from "../../shared/LoanFileUploader";
import LoanDrilldownTabPanel from "../LoanDrilldownTabPanel";
import LoanFilesTable from "./LoanFilesTable";
import FilesTabSection from "./LoanFilesTable/ui/FilesTabSection";

const LoanDrilldownFilesTab = ({ value, tab }) => {
  // Derived State
  const loanDrilldown = useSelector((state) => state?.loanDrilldown);
  const loanDocuments = useMemo(
    () => loanDrilldown?.loanDocuments || [],
    [loanDrilldown]
  );

  // State
  const [layoutMode, setLayoutMode] = useState("all"); // "all" ||  "group"  ||  "hidden"
  const [showUpload, setShowUpload] = useState(false);
  // const [showHiddenFiles, setShowHiddenFiles] = useState(false);

  // Filter documents based on showHiddenFiles setting
  const filteredDocuments = useMemo(() => {
    if (layoutMode === "hidden") {
      return loanDocuments.filter((doc) => doc.isHidden);
    }
    return loanDocuments.filter((doc) => !doc.isHidden);
  }, [loanDocuments, layoutMode]);

  // Calculate counts for display
  const hiddenCount = useMemo(() => {
    return loanDocuments.filter((doc) => doc.isHidden).length;
  }, [loanDocuments]);

  const visibleCount = useMemo(() => {
    return loanDocuments.filter((doc) => !doc.isHidden).length;
  }, [loanDocuments]);

  const tableHeaderTitle = useMemo(() => {
    return `All Loan Files (${visibleCount})`;
  }, [visibleCount]);

  return (
    <LoanDrilldownTabPanel value={value} tab={tab}>
      <ScreenContent>
        <ReportExpirationSection documents={filteredDocuments} />

        <FilesTabSection
          title={tableHeaderTitle}
          endContent={
            <Flx gap={1}>
              <DownloadLoanFilesAsZipButton
                loanId={loanDrilldown?._id}
                loanNumber={loanDrilldown?.loanNumber}
              />

              <Button
                size="medium"
                variant="outlined"
                onClick={() => setShowUpload(true)}
                startIcon={<FileUploadOutlined className="thin" />}
              >
                Upload Files
              </Button>
              <LoanFileUploader
                show={showUpload}
                onClose={() => setShowUpload(false)}
              />
            </Flx>
          }
        >
          <LoanFilesTableContent
            files={filteredDocuments}
            layoutMode={layoutMode}
            setLayoutMode={setLayoutMode}
            // showHiddenFiles={showHiddenFiles}
            // setShowHiddenFiles={setShowHiddenFiles}
            hiddenCount={hiddenCount}
          />
        </FilesTabSection>
      </ScreenContent>
    </LoanDrilldownTabPanel>
  );
};

const LoanFilesTableContent = ({
  files,
  showHiddenFiles,
  setShowHiddenFiles,
  hiddenCount,
  layoutMode,
  setLayoutMode,
}) => {
  const dispatch = useDispatch();
  const { loading, updateLoanDocMetadata } = useLoanFilesHook();
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  // Local state for the grid’s row data
  const [rowData, setRowData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [changedRows, setChangedRows] = useState([]);

  // More local state
  const [quickFilter, setQuickFilter] = useState(null);

  const [editing, setEditing] = useState(false);

  // Config
  const changedRowsCount = useMemo(() => size(changedRows), [changedRows]);

  const groupByCategory = useMemo(() => {
    if (layoutMode === "group") {
      return true;
    }
    return false;
  }, [layoutMode]);

  // Functions
  const handleLayoutModeChange = useCallback((event, newMode) => {
    if (newMode !== null) {
      setLayoutMode(newMode);
    }
  }, []);

  const onHiddenFilesChange = useCallback((e) => {
    setShowHiddenFiles(e);
  }, []);

  const onEditClick = useCallback(() => {
    setEditing(true);
  }, []);

  const onEditCancel = () => {
    setRowData(files.map((f) => ({ ...f })));
    setSelectedRows([]);
    setChangedRows([]);
    setEditing(false);
  };

  const onUpdateClick = () => {
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
    // Copy “files” into our local state so we can edit
    // setRowData(files);
    setRowData(files.map((f) => ({ ...f })));
    // Clearing any prior changedRows if "files" has changed
    setSelectedRows([]);
    setChangedRows([]);
    setEditing(false);
  }, [files]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (changedRowsCount > 0) {
        // Chrome requires returnValue to be set
        event.preventDefault();
        event.returnValue = "";
        // returnValue = '' is needed for most browsers to show the native prompt
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [changedRowsCount]);
  return (
    <Card
      sx={{
        p: 0,

        // overflow: "hidden",
      }}
    >
      <FileTableCardHeader
        //
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        // Layout
        layoutMode={layoutMode}
        setLayoutMode={setLayoutMode}
        onLayoutChange={handleLayoutModeChange}
        // Hidden Files
        showHiddenFiles={showHiddenFiles}
        onHiddenFilesChange={onHiddenFilesChange}
        hiddenCount={hiddenCount}
        // Editing
        editing={editing}
        onEditCancel={onEditCancel}
        onEditClick={onEditClick}
        // Updating

        changedRows={changedRows}
        onUpdateClick={onUpdateClick}
        changedRowsCount={changedRowsCount}
        loading={loading}
      />
      {/* <BulkActionsToolbar selectedRows={selectedRows} /> */}
      <LoanFilesTable
        // onClearFiles={onClearFiles}
        rowData={rowData}
        setRowData={setRowData}
        groupByCategory={groupByCategory}
        editing={editing}
        changedRows={changedRows}
        setChangedRows={setChangedRows}
        quickFilter={quickFilter}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        // onModalClose={onModalClose}
      />
    </Card>
  );
};

const FileTableCardHeader = ({
  quickFilter,
  setQuickFilter,
  layoutMode,
  onLayoutChange,

  onUpdateClick,
  loading,

  //Display values
  changedRowsCount,
  hiddenCount,

  //Editing
  editing,
  onEditCancel,
  onEditClick,
}) => {
  const rootStyles = useMemo(() => {
    return {
      p: 1,
      borderBottom: `1px solid ${grey[300]}`,
      display: "flex",
      alignItems: "center",
      gap: 2,
      flexWrap: "wrap",
      position: "sticky",
      top: 0,
      left: 0,
    };
  }, []);

  return (
    <Box sx={rootStyles}>
      <Flx fw gap={1} ac wrap sx={{ flex: 1, minWidth: 250 }}>
        <SearchInput
          value={quickFilter}
          onChange={setQuickFilter}
          // sx={{ flexGrow: 1 }}
        />
        <LayoutToggle
          editing={editing}
          value={layoutMode}
          onChange={onLayoutChange}
          hiddenCount={hiddenCount}
        />
      </Flx>

      <Flx
        gap={1}
        ac
        sx={{
          ".MuiSvgIcon-root": {
            fontSize: "16px",
          },
        }}
      >
        {editing ? (
          <>
            <Button
              startIcon={<CancelRounded className="thin-7" />}
              variant="outlined"
              color="error"
              size="medium"
              onClick={onEditCancel}
              sx={{ fontWeight: 400 }}
            >
              Cancel Editing
            </Button>
            <Button
              loading={loading}
              size="medium"
              disabled={changedRowsCount < 1}
              onClick={onUpdateClick}
              color="success"
              sx={{ fontWeight: 400, background: green[700] }}
              startIcon={<SaveOutlined className="thin-7" />}
            >
              Save Changes ({changedRowsCount})
            </Button>
          </>
        ) : (
          <Button
            variant="text"
            size="medium"
            onClick={onEditClick}
            startIcon={
              <EditOutlined
                className="thin-9"
                sx={{ fontSize: "16px !important" }}
              />
            }
            sx={{ fontWeight: 400 }}
          >
            Edit Files
          </Button>
        )}
      </Flx>
    </Box>
  );
};

const LayoutToggle = ({ value, onChange, editing, hiddenCount }) => {
  return (
    <ToggleButtonGroup
      value={value}
      exclusive
      disabled={editing}
      onChange={onChange}
      size="small"
      sx={{
        "& .MuiToggleButton-root": {
          textTransform: "none",
          fontSize: "12px",
          px: 1.5,
        },
      }}
    >
      <ToggleButton value="all">
        <ViewListOutlined className="thin" sx={{ fontSize: "16px", mr: 0.5 }} />
        All Files
      </ToggleButton>
      <ToggleButton value="group">
        <AccountTreeOutlined
          className="thin"
          sx={{ fontSize: "16px", mr: 0.5 }}
        />
        Group By Category
      </ToggleButton>
      {hiddenCount > 0 ? (
        <ToggleButton value="hidden">
          <VisibilityOffOutlined
            className="thin"
            sx={{ fontSize: "16px", mr: 0.5 }}
          />
          Hidden Files ({hiddenCount})
        </ToggleButton>
      ) : null}
    </ToggleButtonGroup>
  );
};

// const TableOptionsMenuButton = ({ children }) => {
//   const tableOptionsItems = useMemo(() => {
//     return [
//       {
//         label: "Edit Document",
//         icon: <EditOutlined fontSize="small" />,
//         onClick: () => {},
//         component: (
//           <Flx ac jb gap={4}>
//             <Txt variant="body2">Include Hidden Files ({hiddenCount})</Txt>
//             <Switch
//               size="small"
//               checked={showHiddenFiles}
//               onChange={(e) => onHiddenFilesChange(e.target.checked)}
//             />
//           </Flx>
//         ),
//       },
//       {
//         label: "Mark As Final",
//         icon: <CheckRounded fontSize="small" />,
//         onClick: () => {},
//         loading: markFinalLoading,
//         loadingLabel: "Marking...",
//       },
//     ];
//   }, []);
//   return (
//     <MoreOptionsDropdown
//       title={"Table Options"}
//       tooltip="Table Options"
//       items={tableOptionsItems}
//       keepOpenOnComponentInteract
//       icon={<TuneRounded className="thin" />}
//     />
//   );
// };

// const FileDocGroupsSection = ({ documents }) => {
//   const groups = useMemo(() => {
//     // get unique groups, then sort alphabetically
//     const uniqueGroups = uniq(documents?.map((doc) => doc.docGroup));
//     return sortBy(uniqueGroups, (g) => g?.toLowerCase());
//   }, [documents]);

//   if (isEmpty(groups)) {
//     return null;
//   }
//   return (
//     <FilesTabSection title="Document Groups">
//       <FlxGrid>
//         {groups.map((group) => {
//           const docSize = size(
//             documents.filter((doc) => doc.docGroup === group)
//           );

//           const groupName = isNil(group) ? "No Category" : group;
//           return (
//             <Card
//               key={groupName}
//               sx={
//                 {
//                   // flexGrow: 1,
//                   // flexBasis: "300px",
//                   // flexShrink: 0,
//                 }
//               }
//             >
//               <Flx
//                 ac
//                 gap={1.5}
//                 // column
//                 // gap={1}
//                 //
//               >
//                 <Flx
//                   center
//                   sx={{
//                     background: grey[100],
//                     // p: 1,
//                     width: 40,
//                     height: 40,
//                     borderRadius: 1,
//                     flexGrow: 0,
//                   }}
//                 >
//                   <LoanDocumentGroupIcon docGroup={group} />
//                 </Flx>
//                 <Txt>{`${groupName} (${docSize})`}</Txt>
//               </Flx>
//             </Card>
//           );
//         })}
//       </FlxGrid>
//     </FilesTabSection>
//   );
// };

const ReportExpirationSection = ({ documents }) => {
  // 1. keep only docs that have a reportEffectiveDate
  const reportDocs = useMemo(
    () => documents.filter((doc) => doc.reportEffectiveDate),
    [documents]
  );
  if (isEmpty(reportDocs)) {
    return null;
  }
  return (
    <FilesTabSection title="Time Sensitive Documents">
      <ReportExpirationCards documents={documents} />
    </FilesTabSection>
  );
};

const ReportExpirationCards = ({ documents }) => {
  const reportDocs = useMemo(
    () => documents.filter((doc) => doc.reportEffectiveDate),
    [documents]
  );

  const docsWithStatus = useMemo(
    () =>
      reportDocs?.map((doc) => {
        const effective = new Date(doc.reportEffectiveDate);
        const daysToExpire = Number(doc.reportGuidelineExpirationDays);
        const expiration = new Date(
          effective.getTime() + daysToExpire * 24 * 60 * 60 * 1000
        );

        const now = Date.now();
        const effectiveMs = effective.getTime();
        const expirationMs = expiration.getTime();

        // total span and remaining span, in ms:
        const totalSpan = expirationMs - effectiveMs;
        const remainingSpan = Math.max(0, expirationMs - now);

        // percent remaining:
        const percentRemaining = (remainingSpan / totalSpan) * 100;

        // diffDays (for your label):
        const diffDays = Math.ceil(
          (expirationMs - now) / (1000 * 60 * 60 * 24)
        );

        let status;
        if (diffDays < 0) status = "expired";
        else if (diffDays <= 10) status = "expiringSoon";
        else status = "valid";

        return {
          ...doc,
          expiration,
          diffDays,
          status,
          percentRemaining,
        };
      }),
    [reportDocs]
  );

  if (!docsWithStatus.length) {
    return <Txt>No reports with an effective date.</Txt>;
  }

  return (
    <FlxGrid grow={0}>
      {docsWithStatus.map((doc) => {
        let chipColor, chipLabel;
        switch (doc.status) {
          case "valid":
            chipColor = "success";
            chipLabel = `${doc.diffDays} days until expires`;
            break;
          case "expiringSoon":
            chipColor = "warning";
            chipLabel = `${doc.diffDays} days until expires`;
            break;
          case "expired":
            chipColor = "error";
            chipLabel = `Expired ${-doc.diffDays} days ago`;
            break;
          default:
            chipColor = "default";
            chipLabel = "";
        }

        return (
          <Card key={doc._id} a>
            <Flx column gap={3}>
              <Flx ac gap={1}>
                <LoanDocumentGroupIcon styled docGroup={doc?.docGroup} />
                <Flx column>
                  <Txt>{doc.file_display_name}</Txt>
                  <Txt secondary fontStyle="italic">
                    {doc.docType}
                  </Txt>
                </Flx>
              </Flx>
              <Flx gap={1} column sx={{ ".txt": { fontSize: "11px" } }}>
                <Flx fw jb ac>
                  <Txt secondary>
                    {`Effective: ${new Date(
                      doc.reportEffectiveDate
                    ).toLocaleDateString()}`}
                  </Txt>
                  <Txt secondary>
                    {`Expires: ${doc.expiration.toLocaleDateString()}`}
                  </Txt>
                </Flx>
                <Flx column gap={1}>
                  <LinearProgress
                    variant="determinate"
                    value={doc.percentRemaining}
                    color={chipColor}
                    sx={{ width: "100%" }}
                  />
                  <Txt secondary>{chipLabel}</Txt>
                </Flx>
              </Flx>
            </Flx>
          </Card>
        );
      })}
    </FlxGrid>
  );
};

const DownloadLoanFilesAsZipButton = ({ loanId, loanNumber }) => {
  const { loading, downloadLoanDocs } = useLoanFilesHook();

  const onDownloadClick = () => {
    downloadLoanDocs({
      loanId: loanId,
      fileDownloadName: `Loan ${loanNumber} Files`,
    });
  };

  return (
    <Button
      size="medium"
      loading={loading}
      variant="outlined"
      onClick={onDownloadClick}
      startIcon={<DownloadOutlined className="thin" />}
    >
      Download Files
    </Button>
  );
};

export default LoanDrilldownFilesTab;
