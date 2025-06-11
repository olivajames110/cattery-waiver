import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditableDataRow from "../../../../components/common/EditableDataRow";
import RffLoanDataGroup from "../../../../components/finalForm/shared/RffLoanDataGroup";
import Flx from "../../../../components/layout/Flx";
import ScreenContent from "../../../../components/layout/ScreenContent";
import TabPanel from "../../../../components/navigation/TabPanel";
import TitledCard from "../../../../components/ui/TitledCard";
// icons
import {
  AddRounded,
  AttachFileOutlined,
  ChevronRightRounded,
  CloseRounded,
  EastRounded,
  FeedOutlined,
  PeopleOutline,
  QuestionAnswerOutlined,
  SpeakerNotesOffRounded,
  StoreOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Card,
  IconButton,
  InputLabel,
  LinearProgress,
  Tooltip,
} from "@mui/material";
import { AgGridReact } from "ag-grid-react";
import { isEmpty, isEqual, isNil, over, size } from "lodash";
import { useNavigate } from "react-router-dom";
import { columnTypesBoolean } from "../../../../_src_shared/utils/agGrid/columnTypes/columnTypesBoolean";
import AgGridTableWrapper from "../../../../components/agGrid/AgGridTableWrapper";
import ProgressStepper from "../../../../components/common/ProgressStepper";
import SelectInput from "../../../../components/inputs/SelectInput";
import TitledGroup from "../../../../components/ui/TitledGroup";
import { selectOptionsLoanProductType } from "../../../../constants/selectOptions/selectOptionsLoanProductType";
import { selectOptionsLoanPurpose } from "../../../../constants/selectOptions/selectOptionsLoanPurpose";
import { selectOptionsLoanStatus } from "../../../../constants/selectOptions/selectOptionsLoanStatus";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import {
  sidebarSetValues,
  sidebarTypeToggle,
} from "../../../../redux/actions/sidebarActions";
import LoanDocumentsTreeMap from "../../shared/LoanDocumentsTreeMap";
import LoanFileUploader from "../../shared/LoanFileUploader";
import LoanBorrowersMinimalTable from "../LoanDrilldownPropertiesTab/LoanBorrowersMinimalTable";
import LoanPropertiesMinimalTable from "../LoanDrilldownPropertiesTab/LoanPropertiesMinimalTable";
import { columnTypesDate } from "../../../../_src_shared/utils/agGrid/columnTypes/columnTypesDate";
import CommentItemRenderer from "../../../../_src_shared/comments/CommentItemRenderer";
import Txt from "../../../../components/typography/Txt";
import { loanDrilldownSidebarTypes } from "../../../../constants/enums/loanDrilldownScreenSidebarOptions";
import { grey } from "@mui/material/colors";
import { loanPipelineClear } from "../../../../redux/actions/loanPipelineActions";
import { selectOptionsPipelineType } from "../../../../constants/selectOptions/selectOptionsPipelineType";
import { selectOptionsInterestCalcType } from "../../../../constants/selectOptions/selectOptionsInterestCalcType";
import FlxGrid from "../../../../_src_shared/components/layout/FlxGrid";

// your existing select options

// For any new options you need, e.g. amortizationType, interestCalcType, etc.

const LoanDrilldownSummaryTab = () => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const baseUrl = useMemo(
    () => `/loan/${loanDrilldown?.loanNumber}`,
    [loanDrilldown]
  );
  return (
    <TabPanel>
      <ScreenContent
        sx={{
          maxWidth: "1800px",
          // maxWidth: "1440px",
          pb: 24,
          margin: "0px auto",
        }}
      >
        {/* <TitledCard title="Loan Status" sx={{ p: 0 }}>
          <LoanProgressStepper />
        </TitledCard> */}
        <Flx column gap={3}>
          <Flx wrap gap={3}>
            <SummaryCard baseUrl={baseUrl} />
            <CommentsCard baseUrl={baseUrl} />
          </Flx>
          <Flx gap={3} wrap>
            {/* <LoanFilesCard /> */}
            <BorrowersCard baseUrl={baseUrl} />
            <PropertiesCard baseUrl={baseUrl} />
          </Flx>
          <LoanFilesCard />
        </Flx>
      </ScreenContent>
    </TabPanel>
  );
};

const LoanProgressStepper = ({ children }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  /**
   * Memoized values
   */
  const activeStep = selectOptionsLoanStatus.indexOf(loanDrilldown?.loanStatus);
  const currentLoanStatus = useMemo(
    () => loanDrilldown?.loanStatus,
    [loanDrilldown?.loanStatus]
  );

  const statusList = useMemo(() => {
    if (!currentLoanStatus) {
      // Only show up to "Closed"
      const closedIndex = selectOptionsLoanStatus.indexOf("Closed");
      return selectOptionsLoanStatus.slice(0, closedIndex + 1);
    }

    // Find the index of the current status
    const currentStatusIndex =
      selectOptionsLoanStatus.indexOf(currentLoanStatus);

    // If current status is "Closed" or greater, show all options
    const closedIndex = selectOptionsLoanStatus.indexOf("Closed");
    if (currentStatusIndex >= closedIndex) {
      return selectOptionsLoanStatus;
    }

    // Otherwise, only show options up to "Closed"
    return selectOptionsLoanStatus.slice(0, closedIndex + 1);
  }, [currentLoanStatus]);

  return <ProgressStepper activeStep={activeStep} statusList={statusList} />;
};

const SummaryCard = ({ baseUrl }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { updateLoanData } = useUnderwritingHook();

  // This function is called when user clicks "Save" in the row
  const handleUpdateField = useCallback(
    ({ field, newValue, values, stopLoadingFn }) => {
      // Skip update if values are the same
      const oldValueDerived = loanDrilldown[field];
      if (isEqual(newValue, oldValueDerived)) return;

      // return;
      // Example: call your API to update data
      updateLoanData({
        loanId: loanDrilldown?._id,
        data: { [field]: newValue },
        onSuccessFn: (res) => {
          dispatch(loanDrilldownSet(res));
          dispatch(loanPipelineClear());
          // let the "loading" spinner turn off
          if (stopLoadingFn) stopLoadingFn();
        },
        onFailFn: (err) => {
          dispatch(loanDrilldownSet(loanDrilldown));
        },
      });
    },
    [loanDrilldown, updateLoanData, dispatch]
  );
  const cellValueSize = useMemo(() => 6, []);
  return (
    <TitledCard
      // title={"Summary"}
      // sx={{ mb: 2 }}
      // variant="h1"
      title={"Summary"}
      icon={<FeedOutlined />}
      // uppercase
      // fontWeight={700}
      cardSx={{ flexBasis: "1020px", flexShink: 0, flexGrow: 1 }}
      variant="h3"
      headerEndContent={<LoanStatusField />}
    >
      <Flx column>
        <LoanProgressStepper />

        <ScreenContent suppressPadding>
          <FlxGrid gap={2} sx={{ mt: 3 }}>
            <TitledGroup
              title={"Overview"}
              // icon={<FeedOutlined />}
              bodySx={{ pt: 1 }}
              variant="h4"
              fontWeight={400}
              suppressPadding
            >
              <RffLoanDataGroup
                // sx={{ pl: 3.42 }}
                column
                initialValues={loanDrilldown}
              >
                {/* <EditableDataRow
                    cellValueSize={cellValueSize }
                    name="loanStatus"
                    label="Loan Status"
                    type="select"
                    options={selectOptionsLoanStatus}
                    onUpdateFn={handleUpdateLoanStatus}
                    data={loanDrilldown}
                  /> */}

                {/* <EditableDataRow
                    cellValueSize={cellValueSize + 1}
                    name="loanName"
                    label="Loan Name"
                    onUpdateFn={handleUpdateField}
                    data={loanDrilldown}
                  /> */}
                <EditableDataRow
                  cellValueSize={cellValueSize + 1}
                  name="loanProductType"
                  label="Loan Product Type"
                  type="select"
                  options={selectOptionsLoanProductType}
                  onUpdateFn={handleUpdateField}
                  data={loanDrilldown}
                />
                <EditableDataRow
                  cellValueSize={cellValueSize + 1}
                  name="loanPurpose"
                  label="Loan Purpose"
                  type="select"
                  options={selectOptionsLoanPurpose}
                  onUpdateFn={handleUpdateField}
                  data={loanDrilldown}
                />
                <EditableDataRow
                  cellValueSize={cellValueSize + 1}
                  name="expectedClosingDate"
                  label="Exp. Closing Date"
                  type="date"
                  onUpdateFn={handleUpdateField}
                  data={loanDrilldown}
                />
                <EditableDataRow
                  cellValueSize={cellValueSize + 1}
                  name="pipeline"
                  label="Current Pipeline"
                  type="select"
                  options={selectOptionsPipelineType}
                  onUpdateFn={handleUpdateField}
                  data={loanDrilldown}
                />
              </RffLoanDataGroup>
            </TitledGroup>

            <TitledGroup
              title={"Terms"}
              variant="h4"
              fontWeight={400}
              bodySx={{ pt: 1 }}
              suppressPadding
            >
              <RffLoanDataGroup column>
                <TermsRenderer
                  cellValueSize={cellValueSize}
                  onUpdateFn={handleUpdateField}
                />
              </RffLoanDataGroup>
            </TitledGroup>

            <TitledGroup
              title={"Assignee's"}
              variant="h4"
              fontWeight={400}
              bodySx={{ pt: 1 }}
              suppressPadding
            >
              <RffLoanDataGroup
                // sx={{ pl: 3.42 }}
                column
                initialValues={loanDrilldown}
              >
                <EditableDataRow
                  cellValueSize={cellValueSize + 1}
                  placeholder="—"
                  name="salesperson"
                  label="Salesperson"
                  type="selectUserEmail"
                  onUpdateFn={handleUpdateField}
                  data={loanDrilldown}
                />

                <EditableDataRow
                  cellValueSize={cellValueSize + 1}
                  placeholder="—"
                  name="loanProcessor"
                  label="Processor"
                  type="selectUserEmail"
                  onUpdateFn={handleUpdateField}
                  data={loanDrilldown}
                />

                <EditableDataRow
                  cellValueSize={cellValueSize + 1}
                  placeholder="—"
                  name="loanUnderwriter"
                  label="Underwriter"
                  type="selectUserEmail"
                  onUpdateFn={handleUpdateField}
                  data={loanDrilldown}
                />

                <EditableDataRow
                  cellValueSize={cellValueSize + 1}
                  placeholder="—"
                  name="loanCloser"
                  label="Closer"
                  type="selectUserEmail"
                  onUpdateFn={handleUpdateField}
                  data={loanDrilldown}
                />
              </RffLoanDataGroup>
            </TitledGroup>
          </FlxGrid>
          <Flx end fw sx={{ pt: 2, pb: 0 }}>
            <Button
              variant="text"
              onClick={() => navigate(`${baseUrl}/loan-information`)}
              endIcon={<EastRounded className="thin" />}
            >
              Go to Loan Information
            </Button>
          </Flx>
        </ScreenContent>
      </Flx>
    </TitledCard>
  );
};

const TermsRenderer = ({ cellValueSize, onUpdateFn }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  const pt = useMemo(
    () => loanDrilldown?.loanProductType,
    [loanDrilldown?.loanProductType]
  );
  const showHoldback = useMemo(() => {
    if (isNil(pt)) return false;

    if (
      pt === "Fix and Flip" ||
      pt === "Ground Up Construction" ||
      pt === "Vacant Land"
    ) {
      return true;
    }

    return false;
  }, [pt]);

  if (pt === "DSCR") {
    return (
      <>
        <EditableDataRow
          cellValueSize={cellValueSize}
          placeholder="—"
          name="baseLoanAmount"
          label="Base Loan Amount"
          type="dollar"
          onUpdateFn={onUpdateFn}
          data={loanDrilldown}
        />

        <EditableDataRow
          cellValueSize={cellValueSize}
          name="outstandingLoanUpb"
          label="Outstanding Loan UPB"
          type="dollar"
          onUpdateFn={onUpdateFn}
          data={loanDrilldown}
        />
        <EditableDataRow
          cellValueSize={cellValueSize}
          placeholder="—"
          name="interestRate"
          label="Interest Rate"
          type="percent"
          onUpdateFn={onUpdateFn}
          data={loanDrilldown}
        />
        <EditableDataRow
          cellValueSize={cellValueSize}
          placeholder="—"
          name="interestCalcType"
          label="Interest Calc Type"
          type="select"
          options={selectOptionsInterestCalcType}
          onUpdateFn={onUpdateFn}
          data={loanDrilldown}
        />
      </>
    );
  }
  return (
    <>
      <EditableDataRow
        cellValueSize={cellValueSize}
        placeholder="—"
        name="baseLoanAmount"
        label="Base Loan Amount"
        type="dollar"
        onUpdateFn={onUpdateFn}
        data={loanDrilldown}
      />
      {showHoldback ? (
        <EditableDataRow
          cellValueSize={cellValueSize}
          placeholder="—"
          name="totalHoldback"
          label="Total Holdback"
          type="dollar"
          onUpdateFn={onUpdateFn}
          data={loanDrilldown}
        />
      ) : null}
      <EditableDataRow
        cellValueSize={cellValueSize}
        placeholder="—"
        name="interestRate"
        label="Interest Rate"
        type="percent"
        onUpdateFn={onUpdateFn}
        data={loanDrilldown}
      />
      <EditableDataRow
        cellValueSize={cellValueSize}
        placeholder="—"
        name="interestCalcType"
        label="Interest Calc Type"
        type="select"
        options={selectOptionsInterestCalcType}
        onUpdateFn={onUpdateFn}
        data={loanDrilldown}
      />
    </>
  );
};

/**
 * Cards
 */

const CommentsCard = ({ baseUrl }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const dispatch = useDispatch();

  const comments = useMemo(
    () => loanDrilldown?.comments,
    [loanDrilldown?.comments]
  );

  return (
    <TitledCard
      title={`Comments (${size(comments)})`}
      icon={<QuestionAnswerOutlined className="thin" />}
      headerEndContent={
        <Tooltip title="Add New Comment" disableInteractive>
          <IconButton
            onClick={() =>
              dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.COMMENTS))
            }
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <AddRounded className="thin" />
          </IconButton>
        </Tooltip>
      }
      cardSx={{
        display: "flex",
        flexBasis: "400px",
        flexShink: 0,
        flexGrow: 1,
      }}
      innerSx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
      bodySx={{
        // pt: 0,
        // p: 0,
        // pt: 3,
        // pt: 0,
        pb: 0,
        p: 0,
        flexDirection: "column",
        flexGrow: 1,
        minHeight: "200px",
        display: "flex",
        justifyContent: "space-between",
      }}
      variant="h3"
    >
      {isEmpty(comments) ? (
        <Flx column gap={2} center ac sx={{ height: "100%" }}>
          <SpeakerNotesOffRounded
            sx={{ fontSize: "24px", color: grey[400] }}
            className="thin"
          />
          <Txt color={grey[600]}>No comments added</Txt>
          <Button
            onClick={() =>
              dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.COMMENTS))
            }
            endIcon={<AddRounded className="thin" />}
          >
            Add Comment
          </Button>
        </Flx>
      ) : (
        <>
          <CommentItemRenderer
            comments={comments}
            sx={{
              maxHeight: "285px",
              overflowY: "auto",
            }}
          />
          <Flx end fw sx={{ p: 2 }}>
            <Button
              variant="text"
              onClick={() =>
                dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.COMMENTS))
              }
              endIcon={<EastRounded className="thin" />}
            >
              View All
            </Button>
          </Flx>
        </>
      )}
    </TitledCard>
  );
};

const BorrowersCard = ({ baseUrl }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const navigate = useNavigate();

  return (
    <TitledCard
      title={`Borrowers (${size(loanDrilldown?.borrowers)})`}
      variant="h3"
      icon={<PeopleOutline />}
      cardSx={{ flexBasis: "400px", flexGrow: 1, flexShrink: 0 }}
      suppressPadding
      // suppressBodyPadding
      bodySx={{ pt: 2, pb: 0 }}
    >
      <LoanBorrowersMinimalTable
        height={"200px"}
        rowData={loanDrilldown?.borrowers}
      />
      <Flx end fw sx={{ p: 2 }}>
        <Button
          variant="text"
          onClick={() => navigate(`${baseUrl}/borrowers`)}
          endIcon={<EastRounded className="thin" />}
        >
          Go to Borrowers
        </Button>
      </Flx>
    </TitledCard>
  );
};

const PropertiesCard = ({ baseUrl }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const navigate = useNavigate();

  return (
    <TitledCard
      title={`Properties (${size(loanDrilldown?.subjectProperties)})`}
      suppressPadding
      icon={<StoreOutlined />}
      // suppressBodyPadding
      cardSx={{ flexBasis: "400px", flexGrow: 1, flexShrink: 0 }}
      variant="h3"
      // bodySx={{ pt: 2 }}
      bodySx={{ pt: 2, pb: 0 }}
    >
      <LoanPropertiesMinimalTable
        rowData={loanDrilldown?.subjectProperties}
        height={"200px"}
      />
      <Flx end fw sx={{ p: 2 }}>
        <Button
          variant="text"
          onClick={() => navigate(`${baseUrl}/properties`)}
          endIcon={<EastRounded className="thin" />}
        >
          Go to Properties
        </Button>
      </Flx>
    </TitledCard>
  );
};

const LoanFilesCard = ({ children }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const [showUpload, setShowUpload] = useState(false);
  const loanDocuments = useMemo(
    () => loanDrilldown?.loanDocuments,
    [loanDrilldown?.loanDocuments]
  );
  const filesDataInit = useMemo(() => {
    return {
      docGroup: null,
      docType: null,
    };
  }, []);

  const [filesData, setFilesData] = useState(filesDataInit);

  const activeDocGroup = useMemo(() => filesData?.docGroup, [filesData]);
  const activeDocType = useMemo(() => filesData?.docType, [filesData]);

  const handleOnTreeMapClick = useCallback(
    (params) => {
      console.log("params", params);
      const group =
        filesData?.docGroup === params?.docGroup ? null : params?.docGroup;
      const type =
        filesData?.docType === params?.docType ? null : params?.docType;

      setFilesData({ docGroup: group, docType: type });
    },
    [filesData]
  );

  const handleOnDocGroupClick = useCallback((docGroup) => {
    setFilesData({ docGroup, docType: null });
  }, []);

  const handleClearFiles = useCallback(
    (params) => {
      console.log("handleOnTreeMapClick", params);

      setFilesData(filesDataInit);
    },
    [filesDataInit]
  );

  return (
    <TitledCard
      title={`Uploaded Files (${size(loanDrilldown?.loanDocuments)})`}
      suppressPadding
      variant="h3"
      icon={<AttachFileOutlined />}
      suppressBodyPadding
      headerEndContent={
        <Tooltip title="Upload New Files" disableInteractive>
          <IconButton
            onClick={() => setShowUpload(true)}
            sx={{ position: "absolute", right: 10, top: 10 }}
          >
            <AddRounded className="thin" />
          </IconButton>
        </Tooltip>
      }
      // sx={{ flexBasis: "400px", flexGrow: 1, flexShrink: 0 }}
      bodySx={{ pt: 0, px: 0 }}
    >
      <LoanFilesBarChart
        loanDocuments={loanDocuments}
        onClick={handleOnTreeMapClick}
        activeDocGroup={activeDocGroup}
        activeDocType={activeDocType}
      />
      <LoanDocumentsTableNavigation
        loanDocuments={loanDocuments}
        activeDocGroup={activeDocGroup}
        onDocGroupClick={handleOnDocGroupClick}
        activeDocType={activeDocType}
        clearFiles={handleClearFiles}
      />
      <LoanFileUploader
        show={showUpload}
        onClose={() => setShowUpload(false)}
      />
    </TitledCard>
  );
};

/**
 * Components
 */

const LoanDocumentsTableNavigation = ({
  activeDocGroup,
  activeDocType,
  onDocGroupClick,
  loanDocuments,
  clearFiles,
}) => {
  if (isEmpty(loanDocuments)) {
    return;
  }
  return (
    <>
      {isNil(activeDocGroup) && isNil(activeDocType) ? null : (
        <Flx fw jb ac sx={{ px: 2, pt: 2 }}>
          <Flx jb ac>
            <Button
              variant="text"
              onClick={() => onDocGroupClick(null)}
              // fontSize={14}
              sx={{
                fontWeight:
                  isNil(activeDocGroup) && isNil(activeDocType) ? 700 : 400,
              }}
            >
              Loan Files
            </Button>

            {isNil(activeDocGroup) ? null : (
              <>
                <ChevronRightRounded className="thin" />
                <Button
                  variant="text"
                  onClick={() => onDocGroupClick(activeDocGroup)}
                  // fontSize={14}
                  sx={{ fontWeight: isNil(activeDocType) ? 700 : 400 }}
                >
                  {activeDocGroup}
                </Button>
              </>
            )}
            {isNil(activeDocType) ? null : (
              <>
                <ChevronRightRounded className="thin" />
                <Button variant="text">{activeDocType}</Button>
              </>
            )}
          </Flx>

          <IconButton onClick={clearFiles} size="small">
            <CloseRounded className="thin" />
          </IconButton>
        </Flx>
      )}

      <Box px={1}>
        <LoanDocumentsTable
          loanDocuments={loanDocuments}
          activeDocGroup={activeDocGroup}
          activeDocType={activeDocType}
        />
      </Box>
    </>
  );
};

const LoanDocumentsTable = ({
  quickFilter,
  loanDocuments,
  activeDocGroup,
  activeDocType,
}) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const [gridApi, setGridApi] = useState(null);

  // Memoize row data
  const rowData = useMemo(() => loanDocuments, [loanDocuments]);

  // Column definitions
  const columnDefs = useMemo(
    () => [
      { headerName: "Name", field: "file_display_name", flex: 1 },
      { headerName: "Document Category", field: "docGroup", sort: "asc" },
      { headerName: "Document Type", field: "docType", sort: "asc" },
      { headerName: "Uploaded", field: "uploadDate", type: "dateTime" },
    ],
    []
  );

  // Default column settings
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

  // Custom column types
  const columnTypes = useMemo(
    () => ({
      ...columnTypesBoolean(),
      ...columnTypesDate(),
    }),
    []
  );

  // AG Grid external‐filter hooks
  const isExternalFilterPresent = useCallback(() => {
    return Boolean(activeDocGroup || activeDocType);
  }, [activeDocGroup, activeDocType]);

  const doesExternalFilterPass = useCallback(
    (node) => {
      const { docGroup, docType } = node.data;

      // Document Group filter
      if (activeDocGroup) {
        if (activeDocGroup === "No Category") {
          // match only when docGroup is null or undefined
          if (docGroup != null) {
            return false;
          }
        } else {
          if (docGroup !== activeDocGroup) {
            return false;
          }
        }
      }

      // Document Type filter
      if (activeDocType) {
        if (activeDocType === "No Category") {
          // match only when docType is null or undefined
          if (docType != null) {
            return false;
          }
        } else {
          if (docType !== activeDocType) {
            return false;
          }
        }
      }

      return true;
    },
    [activeDocGroup, activeDocType]
  );

  // Capture grid API once ready
  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
  }, []);

  // Re-run external filter whenever props change
  // useEffect(() => {
  //   if (gridApi) {
  //     gridApi.onFilterChanged();
  //   }
  // }, [gridApi, activeDocGroup, activeDocType]);

  // Row click handler
  const onRowClicked = useCallback(
    (params) => {
      dispatch(
        sidebarSetValues({
          type: "filePreview",
          state: params.data,
        })
      );
    },
    [dispatch]
  );

  if (isEmpty(rowData)) {
    return null;
  }

  return (
    <AgGridTableWrapper
      sx={{ borderTop: "1px solid #dddddd" }}
      simpleTable
      suppressMinHeightWhenPopulated={rowData}
    >
      <AgGridReact
        ref={ref}
        onGridReady={onGridReady}
        rowData={rowData}
        columnDefs={columnDefs}
        quickFilterText={quickFilter}
        defaultColDef={defaultColDef}
        columnTypes={columnTypes}
        // wire up our external‐filter methods:
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
        onRowClicked={onRowClicked}
        allowDragFromColumnsToolPanel={false}
        domLayout="autoHeight"
        enableCellTextSelection
      />
    </AgGridTableWrapper>
  );
};

const LoanFilesBarChart = ({
  loanDocuments,
  onClick,
  activeDocGroup,
  activeDocType,
}) => {
  return (
    <LoanDocumentsTreeMap
      loanDocuments={loanDocuments}
      onClick={onClick}
      activeDocGroup={activeDocGroup}
      activeDocType={activeDocType}
    />
  );
};

// const FlxGrid = ({
//   container,
//   spacing,
//   size = "100%",
//   sx,
//   ac,
//   grow = 1,
//   jc,
//   children,
// }) => {
//   const styles = useMemo(() => {
//     if (container) {
//       return {
//         flexWrap: "wrap",
//         gap: spacing,
//         width: "100%",
//         flexBasis: size,
//         flexShrink: 0,
//         // flexDirection: "column",
//         flexGrow: grow,
//         ...sx,
//       };
//     }
//     return {
//       flexGrow: grow,
//       flexBasis: size,
//     };
//   }, [container, size, sx, grow]);
//   return (
//     <Flx sx={styles} g={spacing} ac={ac} jc={jc}>
//       {children}
//     </Flx>
//   );
// };

const LoanStatusField = ({ children }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  const dispatch = useDispatch();
  const { loading, updateMilestoneStatus } = useUnderwritingHook();
  const [status, setStatus] = useState(null);

  const currentLoanStatus = useMemo(
    () => loanDrilldown?.loanStatus,
    [loanDrilldown?.loanStatus]
  );

  const handleUpdateLoanStatus = useCallback(
    (newStatus) => {
      // Skip update if values are the same
      const oldStatus = loanDrilldown?.loanStatus;
      console.log("onchange", { newStatus, oldStatus });

      if (isEqual(newStatus, oldStatus)) return;
      setStatus(newStatus);
      // console.log("updateMilestoneStatus", newStatus);
      // return;
      updateMilestoneStatus({
        loanId: loanDrilldown?._id,
        loanStatus: newStatus,
        onSuccessFn: (res) => {
          dispatch(loanDrilldownSet(res));
        },
        onFailFn: (err) => {
          setStatus(oldStatus);
          dispatch(loanDrilldownSet(loanDrilldown));
        },
      });
    },
    [loanDrilldown, dispatch, setStatus]
  );

  useEffect(() => {
    console.log("EFECTTT", currentLoanStatus);
    setStatus(currentLoanStatus);
  }, [currentLoanStatus]);
  return (
    <Flx
      ac
      sx={{
        // position: "absolute",
        // right: 10,
        // top: 10,
        // display: "flex",
        gap: 1,
      }}
    >
      <InputLabel>Milestone Status</InputLabel>
      <Box
        sx={{
          position: "relative",
          width: 220,
          ".MuiSelect-select": {
            fontSize: "12px",
            padding: "6px 8px",
          },
        }}
      >
        <SelectInput
          // fullWidth={false}
          value={status}
          onChange={handleUpdateLoanStatus}
          // value={loanDrilldown?.loanStatus}
          options={selectOptionsLoanStatus}
        />
        {loading ? (
          <LinearProgress
            sx={{
              position: "absolute",
              left: "0px",
              // left: "2px",
              bottom: "0px",
              borderRadius: "2px",
              width: "100%",
              // width: "calc(100% - 4px)",
            }}
          />
        ) : null}
      </Box>
    </Flx>
  );
};

export default LoanDrilldownSummaryTab;
