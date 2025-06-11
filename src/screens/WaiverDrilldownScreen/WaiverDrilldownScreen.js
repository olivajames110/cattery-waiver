import {
  AddBusinessOutlined,
  AddRounded,
  ChevronRight,
  EditNoteOutlined,
  EditOutlined,
  KeyboardReturnOutlined,
  PersonAddOutlined,
  RefreshOutlined,
  SearchOffOutlined,
  UploadFileOutlined,
} from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Tooltip,
  useTheme,
} from "@mui/material";
import { ModuleRegistry } from "ag-grid-community";
import { RichSelectModule } from "ag-grid-enterprise";
import { size, toString } from "lodash";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Navigate,
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import useLocalStorageState from "use-local-storage-state";

import {
  loanDrilldownClear,
  loanDrilldownSet,
} from "../../redux/actions/loanDrilldownActions";

import Flx from "../../components/layout/Flx";
import ScreenHeader from "../../components/layout/ScreenHeader";
import Htag from "../../components/typography/Htag";

// import SendApplicationButton from "../../components/buttons/SendApplicationButton";
import RffLoanDataGroup from "../../components/finalForm/shared/RffLoanDataGroup";

import { isArray, isEmpty, isNil, isObject, isString } from "lodash";
import RffDisplayField from "../../components/finalForm/inputs/RffDisplayField";
import RffSelectMultipleUserEmailField from "../../components/finalForm/inputs/RffSelectMultipleUserEmailField";
import RffForm from "../../components/finalForm/RffForm";
import RffGroup from "../../components/finalForm/shared/RffGroup";
import ScreenContent from "../../components/layout/ScreenContent";
import BasicModal from "../../components/modals/BasicModal";
import Txt from "../../components/typography/Txt";
import { loanDrilldownSidebarTypes } from "../../constants/enums/loanDrilldownScreenSidebarOptions";
import { usePipelineHook } from "../../hooks/usePipelineHook";
import { useUnderwritingHook } from "../../hooks/useUnderwritingHook";
import { loanPipelineSet } from "../../redux/actions/loanPipelineActions";
import {
  navSidebarClose,
  navSidebarOpen,
} from "../../redux/actions/navSidebarActions";
import { sidebarTypeToggle } from "../../redux/actions/sidebarActions";
import LoanDrilldownScreenSidebar from "./LoanDrilldownScreenSidebar";
import LoanDrilldownTotalsLeftSidebar from "./LoanDrilldownTotalsLeftSidebar";
import LoanDrilldownAppraisalsTab from "./tabs/LoanDrilldownAppraisalsTab/LoanDrilldownAppraisalsTab";
import LoanDrilldownBorrowersTab from "./tabs/LoanDrilldownBorrowersTab/LoanDrilldownBorrowersTab";
import LoanDrilldownChecklistTab from "./tabs/LoanDrilldownChecklistTab/LoanDrilldownChecklistTab";
import LoanDrilldownDetailsTab from "./tabs/LoanDrilldownDetailsTab/LoanDrilldownDetailsTab";
import LoanDrilldownEntityTab from "./tabs/LoanDrilldownEntityTab/LoanDrilldownEntityTab";
import LoanDrilldownExceptionsTab from "./tabs/LoanDrilldownExceptionsTab/LoanDrilldownExceptionsTab";
import LoanDrilldownFilesTab from "./tabs/LoanDrilldownFilesTab/LoanDrilldownFilesTab";
import LoanDrilldownPropertiesTab from "./tabs/LoanDrilldownPropertiesTab/LoanDrilldownPropertiesTab";
import LoanDrilldownSummaryTab from "./tabs/LoanDrilldownSummaryTab";
import SendApplicationButton from "../../components/ui/buttons/SendApplicationButton";
import DropdownButton from "../../components/ui/buttons/DropdownButton";
import UpdateLoanDataModal from "../../components/common/UpdateLoanDataModal";

// const commentPayload = {
//   htmlString: "<p>These are fake</p>\n",
//   associations: {
//     loanDocuments: ["111111", "222222"],
//     borrower: ["abcdefgh"],
//   },
// };

// ////// After comment sent, the borrower and docs are associated with the comment are updated

// const borrower = {
//   _id: "abcdefgh",
//   firstName: "Joe",
//   lastName: "Alonso",
//   phone: "6314563374",
//   emailAddress: "joea@email.com",
//   associations: {
//     loanDocuments: ["111111", "222222"], // assume already previously associated
//     comments: ["uniqueCommentId"], // --> added here
//   },
// };

// const loanDocument1 = {
//   _id: "111111",
//   docGroup: "Borrower Documents",
//   docType: "Photo Identification",
//   file_display_name: "Drivers License Front.jpg",
//   associations: {
//     borrower: ["abcdefgh"], // assume already previously associated
//     comments: ["uniqueCommentId"], // --> added here
//   },
// };

// const loanDocument2 = {
//   _id: "222222",
//   docGroup: "Borrower Documents",
//   docType: "Photo Identification",
//   file_display_name: "Drivers License Back.jpg",
//   associations: {
//     borrower: ["abcdefgh"], // assume already previously associated
//     comments: ["uniqueCommentId"], // --> added here
//   },
// };

// Register AG Grid modules
ModuleRegistry.registerModules([RichSelectModule]);
const initialLoanData = {
  _id: "67f44f69e685b472c479f7dd",
};

/** =====================
 * MAIN SCREEN COMPONENT
 * ===================== */
const WaiverDrilldownScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id: loanNumber } = useParams();
  const { loading, getLoanById } = useUnderwritingHook();
  const { getUserPipeline } = usePipelineHook();

  // Redux state
  const loanPipeline = useSelector((state) => state?.loanPipeline);
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  // Local storage state for loan ID mapping
  const [loanIdMap, setLoanIdMap] = useLocalStorageState("loanIdMap", {
    defaultValue: {},
  });

  // Helper function to update loan ID map in local storage
  const updateLoanIdMap = (loanNumber, loanId) => {
    setLoanIdMap((prevMap) => ({
      ...prevMap,
      [loanNumber]: loanId,
    }));
  };

  // Helper function to fetch loan by ID
  const fetchLoanById = (loanId) => {
    getLoanById({
      loanId,
      onSuccessFn: (data) => {
        dispatch(loanDrilldownSet(data));
        // Update the mapping in local storage if we have a valid loanNumber and ID
        if (data.loanNumber && loanId) {
          updateLoanIdMap(data.loanNumber, loanId);
        }
      },
      onFailFn: () => dispatch(loanDrilldownSet({})),
    });
  };

  // Helper function to find loan in pipeline and fetch by ID
  const findLoanInPipelineAndFetch = (pipeline) => {
    const foundLoan = pipeline.find(
      (l) => toString(l.loanNumber) === toString(loanNumber)
    );

    if (isString(foundLoan?._id)) {
      fetchLoanById(foundLoan._id);
    } else {
      dispatch(loanDrilldownSet({}));
    }
  };

  // Load loan details on mount
  useEffect(() => {
    dispatch(navSidebarClose());
    if (loanNumber === "dev") {
      dispatch(loanDrilldownSet(initialLoanData));
      return;
    }
    // If loan data is already loaded, don't fetch again
    if (!isNil(loanDrilldown?._id)) {
      return;
    }

    // Check if we have the loan ID in our local storage map
    const storedLoanId = loanIdMap[loanNumber];

    if (isString(storedLoanId)) {
      // We have the loan ID in local storage, fetch directly
      fetchLoanById(storedLoanId);
    } else {
      // No ID in local storage, need to check pipeline
      if (isArray(loanPipeline) && loanPipeline.length > 0) {
        // Pipeline is already loaded, find loan and fetch
        findLoanInPipelineAndFetch(loanPipeline);
      } else {
        // Need to load pipeline first
        getUserPipeline({
          onSuccessFn: (pipeline) => {
            dispatch(loanPipelineSet(pipeline));
            findLoanInPipelineAndFetch(pipeline);
          },
          onFailFn: () => dispatch(loanDrilldownSet({})),
        });
      }
    }

    // Cleanup on unmount
    return () => {
      dispatch(navSidebarOpen());
    };
  }, [loanNumber]);

  // Display loading state
  if (isNil(loanDrilldown)) {
    return (
      <Flx center sx={{ p: 4, height: "100vh" }}>
        <CircularProgress />
      </Flx>
    );
  }

  // Display "no loan found" state
  if (isObject(loanDrilldown) && isEmpty(loanDrilldown)) {
    return (
      <Flx gap={1} column center sx={{ p: 4, height: "100vh" }}>
        <SearchOffOutlined fontSize="large" />
        <Htag h1>No Loan Found</Htag>
        <Txt>We encountered a problem trying to retrieve your loan.</Txt>
        <Flx sx={{ mt: 1 }}>
          <Button
            startIcon={<KeyboardReturnOutlined />}
            onClick={() => navigate("/loans")}
          >
            Return to Pipeline
          </Button>
        </Flx>
      </Flx>
    );
  }

  // Render content when loan is found
  return <ContentRenderer navigate={navigate} />;
};

/** =========================
 * CONTENT RENDERER
 * ========================= */
const ContentRenderer = memo(({ navigate }) => {
  const [showTotals, setShowTotals] = useState(false);
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const baseUrl = useMemo(
    () => `/loan/${loanDrilldown?.loanNumber}`,
    [loanDrilldown]
  );

  const toggleShowTotals = useCallback(() => {
    setShowTotals((s) => !s);
  }, []);
  const closeTotals = useCallback(() => {
    setShowTotals(false);
  }, []);
  return (
    <Flx
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#f5f8fa",
      }}
    >
      <LoanDrilldownTotalsLeftSidebar
        show={showTotals}
        onClose={closeTotals}
        onOpen={toggleShowTotals}
      />
      <Box
        suppressPadding
        id="overflow-root"
        sx={{
          overflowY: "auto",
          flexGrow: 1,
          height: "100%",
          // "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-track": { backgroundColor: "#f5f8fa" },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.2)",
            // borderRadius: "4px",
          },
          scrollbarColor: "#bbb #f5f8fa",
          // scrollbarWidth: "thin",
        }}
      >
        <DrilldownHeader
          navigate={navigate}
          toggleShowTotals={toggleShowTotals}
        />
        <ScreenContent sx={{ pt: 0, overflowX: "auto", background: "#ffffff" }}>
          <OverviewDisplayFields />
        </ScreenContent>
        <DrilldownPrimaryNavigation baseUrl={baseUrl} />
        <DrilldownContent baseUrl={baseUrl} />
      </Box>
      <LoanDrilldownScreenSidebar />
    </Flx>
  );
});

/** =========================
 * DRILLDOWN HEADER
 * ========================= */
const DrilldownHeader = memo(({ navigate, toggleShowTotals }) => {
  const dispatch = useDispatch();
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const { loading, getLoanById } = useUnderwritingHook();
  const loanId = loanDrilldown?.loanNumber;
  const [showRenameModal, setShowRenameModal] = useState(null);

  const handleReturnToPipeline = () => {
    dispatch(loanDrilldownClear());
    navigate("/loans");
  };

  const loanTitle = useMemo(() => {
    if (isNil(loanDrilldown?.loanName)) {
      return `Loan #${loanDrilldown?.loanNumber}`;
    }
    return loanDrilldown?.loanName || `Loan #${loanDrilldown?.loanNumber}`;
  }, [loanDrilldown]);

  const handleRefresh = () => {
    // This will trigger a reload of the current loan
    dispatch(loanDrilldownClear());
    getLoanById({
      loanId: loanDrilldown?._id,
      onSuccessFn: (data) => {
        dispatch(loanDrilldownSet(data));
      },
      onFailFn: () => dispatch(loanDrilldownSet({})),
    });
  };

  return (
    <ScreenHeader
      titleTopContent={
        <Flx ac gap={1} sx={{ mb: 1.2 }}>
          <Link
            onClick={handleReturnToPipeline}
            sx={{
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "var(--ibm)",
            }}
          >
            Loan Pipeline
          </Link>
          <ChevronRight sx={{ fontSize: "12px" }} />
          <Link
            sx={{
              fontSize: "12px",
              cursor: "pointer",
              fontFamily: "var(--ibm)",
            }}
          >
            Loan {loanId}
          </Link>
        </Flx>
      }
      title={loanTitle}
      titleEndContent={
        <>
          <Tooltip title="Rename Loan Name">
            <IconButton
              sx={{ ml: 1 }}
              size="small"
              onClick={() => setShowRenameModal(loanDrilldown)}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh loan data">
            <IconButton sx={{ ml: 1 }} size="small" onClick={handleRefresh}>
              <RefreshOutlined fontSize="small" />
            </IconButton>
          </Tooltip>

          <UpdateLoanDataModal
            loan={showRenameModal}
            field={"loanName"}
            inputLabel={"New Loan Name"}
            type="text"
            onClose={() => setShowRenameModal(null)}
            onSuccessFn={() => handleRefresh()}
          />
        </>
      }
      endContent={
        <Flx g={1}>
          <SendLoanApplicationsDropdown />
          <AddToLoanButton />
        </Flx>
      }
    />
  );
});

const AddToLoanButton = ({ children }) => {
  const dispatch = useDispatch();
  return (
    <DropdownButton
      // color={"gray"}
      startIcon={<AddRounded className="thin" />}
      variant="outlined"
      options={[
        {
          label: "Upload Loan Files",
          onClick: () =>
            dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.ADD_BORROWER)),
          icon: <UploadFileOutlined className="thin" />,
        },
        {
          label: "Add Borrower",
          onClick: () =>
            dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.ADD_BORROWER)),
          icon: <PersonAddOutlined />,
        },
        {
          label: "Add Property",
          onClick: () =>
            dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.ADD_PROPERTY)),
          icon: <AddBusinessOutlined />,
        },
        // {
        //   label: "Add Appraisal",
        //   onClick: () =>
        //     dispatch(sidebarTypeToggle(loanDrilldownSidebarTypes.ADD_PROPERTY)),
        //   icon: <ImageSearchOutlined />,
        // },
        {
          label: "Add Exception",
          onClick: () =>
            dispatch(
              sidebarTypeToggle(loanDrilldownSidebarTypes.ADD_EXCEPTION)
            ),
          icon: <EditNoteOutlined className="thin" />,
        },
      ]}
    >
      Add To Loan
    </DropdownButton>
  );
};

const SendLoanApplicationsDropdown = ({ children }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  const user = useSelector((state) => state.user);
  const users = useSelector((state) => state.users);
  const userId = users?.find((u) => u.emailAddress === user?.emailAddress)?._id;

  const loanId = loanDrilldown?._id;

  const [show, setShow] = useState(false);
  return (
    <>
      <SendApplicationButton
        modalTitle="Send Loan App"
        urlText="Loan App URL"
        href={`loan-application?userId=${userId}&loanId=${loanId}`}
        onClose={() => setShow(false)}
        show={show === "loan"}
      >
        Send Loan App
      </SendApplicationButton>
    </>
  );
};

/** =========================
 * NAVIGATION TABS
 * ========================= */
const DrilldownPrimaryNavigation = memo(({ baseUrl }) => {
  const theme = useTheme();

  const tabs = useMemo(
    () => [
      "Summary",
      "Loan Information",
      "Files",
      "Entity",
      "Borrowers",
      "Properties",
      "Appraisals",
      "Loan Exceptions",
      "Checklist",
    ],
    []
  );
  return (
    <Flx
      sx={{
        pl: 1,
        background: "#f9f9fc",
        borderTop: `1px solid ${theme.palette.divider}`,
        borderBottom: `1px solid ${theme.palette.divider}`,
        overflowY: "auto",
      }}
    >
      <RouterTabSwitcher tabs={tabs} baseUrl={baseUrl} variant="background" />
    </Flx>
  );
});

/** =========================
 * DRILLDOWN CONTENT
 * ========================= */
const DrilldownContent = memo(({ baseUrl }) => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Routes>
        <Route path="/" element={<LoanDrilldownSummaryTab />} />
        <Route path="/summary" element={<LoanDrilldownSummaryTab />} />
        <Route path="/loan-information" element={<LoanDrilldownDetailsTab />} />
        <Route path="/files/*" element={<LoanDrilldownFilesTab />} />
        <Route path="/borrowers" element={<LoanDrilldownBorrowersTab />} />
        <Route path="/borrowers" element={<LoanDrilldownBorrowersTab />} />
        <Route
          path="/borrowers/:borrowerId?"
          element={<LoanDrilldownBorrowersTab />}
        />

        <Route
          path="/properties/:propertyId?"
          element={<LoanDrilldownPropertiesTab />}
        />
        <Route path="/appraisals" element={<LoanDrilldownAppraisalsTab />} />
        <Route path="/entity" element={<LoanDrilldownEntityTab />} />
        <Route
          path="/loan-exceptions"
          element={<LoanDrilldownExceptionsTab />}
        />
        <Route path="/checklist" element={<LoanDrilldownChecklistTab />} />
        <Route path="*" element={<Navigate to={`${baseUrl}`} replace />} />
      </Routes>
    </Box>
  );
});

const RouterTabSwitcher = ({
  tabs,
  baseUrl = "/loan/",
  orientation = "horizontal",
  variant = "background",
  underlinePosition = "bottom",
}) => {
  const theme = useTheme();
  const location = useLocation();

  const currentPath = location.pathname.replace(/\/$/, "");
  const cleanBase = baseUrl.replace(/\/$/, "");

  const styles = useMemo(() => {
    return {
      display: "flex",
      flexDirection: orientation === "horizontal" ? "row" : "column",
      ".nav-link": {
        fontFamily: "var(--ibm)",
        color: "#181d1f",
        fontWeight: 400,
        fontSize: "13px",
        p: 1.5,
        borderRadius: 0,
        whiteSpace: "nowrap",
        // padding: theme?.spacing(0.5, 1),
        // margin: theme?.spacing(0.5),

        textDecoration: "none",
        transition: "all 0.2s ease",

        // Prevent text wrapping in vertical orientation
        ...(orientation === "vertical" && {
          whiteSpace: "nowrap",
          minWidth: "fit-content",
          justifyContent: "flex-start",
          textAlign: "left",
          borderLeft: "2px solid transparent",
        }),

        "&.active": {
          color: "#2962ff",
          fontWeight: 700,
          borderBottom: "2px solid #2962ff",

          // Override default background for variants
          ...(variant === "underline"
            ? {
                background: "none",
                borderRadius: "0 !important",
                fontWeight: 500,
              }
            : {
                background: "#2962ff14",
              }),

          // Handle border placement based on orientation and position
          ...(variant === "underline" && {
            ...(orientation === "horizontal" &&
              underlinePosition === "bottom" && {
                borderBottom: "2px solid #2962ff",
              }),
            ...(orientation === "horizontal" &&
              underlinePosition === "top" && {
                borderTop: "2px solid #2962ff",
              }),
            ...(orientation === "vertical" &&
              underlinePosition === "left" && {
                borderLeft: "2px solid #2962ff",
              }),
            ...(orientation === "vertical" &&
              underlinePosition === "right" && {
                borderRight: "2px solid #2962ff",
              }),
          }),
        },
      },
    };
  }, [theme, orientation, variant, underlinePosition]);

  // Helper function to determine if a tab should be active
  const isTabActive = (tabKey, linkActive) => {
    const isSummary = tabKey === "summary";

    if (isSummary) {
      return [cleanBase, `${cleanBase}/summary`].includes(currentPath);
    }

    // For borrowers and properties tabs, check if current path starts with the tab path
    if (tabKey === "borrowers") {
      return currentPath.includes(`${cleanBase}/borrowers`);
    }

    if (tabKey === "properties") {
      return currentPath.includes(`${cleanBase}/properties`);
    }

    // For other tabs, use the default NavLink active state
    return linkActive;
  };

  return (
    <Box sx={styles}>
      {tabs.map((tab) => {
        const tabKey = isString(tab)
          ? tab.toLowerCase().replace(/\s+/g, "-")
          : tab.path;
        const label = isString(tab) ? tab : tab.label;

        const isSummary = tabKey === "summary";
        // summary links to the bare base, others to base/<tabKey>
        const to = isSummary ? cleanBase : `${cleanBase}/${tabKey}`;

        return (
          <NavLink
            key={tabKey}
            to={to}
            // only force NavLink to do exact matching on the non-Summary tabs
            end={!isSummary}
            className={({ isActive: linkActive }) => {
              const manualActive = isTabActive(tabKey, linkActive);
              return `nav-link${manualActive ? " active" : ""}`;
            }}
          >
            {label}
          </NavLink>
        );
      })}
    </Box>
  );
};
/** =========================
 * HELPER COMPONENTS
 * ========================= */
const OverviewDisplayFields = memo(() => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  const borrowerNames = useMemo(() => {
    const borrowers = loanDrilldown?.borrowers;
    if (isEmpty(borrowers)) {
      return "None";
    }

    return borrowers
      ?.map((b) => {
        const { firstName, lastName } = b;
        return `${firstName} ${lastName}`;
      })
      .join(", ");
  }, [loanDrilldown?.borrowers]);

  const propertyNames = useMemo(() => {
    const properties = loanDrilldown?.subjectProperties;
    if (isEmpty(properties)) {
      return "None";
    }

    return properties
      ?.map((p) => {
        return `${isNil(p?.address?.fullAddress) ? "N/A" : p?.address?.fullAddress}`;
      })
      .join(", ");
  }, [loanDrilldown?.subjectProperties]);

  return (
    <RffLoanDataGroup
      sx={{
        mt: 1,
        // flexWrap: "wrap",
        ".MuiGrid-root": {
          mr: 2,
          // mr: 3,
          flexShrink: 0,
          minWidth: "72px",
          ".MuiFormLabel-root , .MuiTypography-root": {
            whiteSpace: "nowrap",
          },
        },
      }}
      row
      gap={2}
    >
      <RffDisplayField
        name="loanNumber"
        label="Loan Number"
        type="select"
        data={loanDrilldown}
      />
      <RffDisplayField
        name={"loanStatus"}
        label={"Milestone Status"}
        type={"select"}
        data={loanDrilldown}
      />
      <Seperator />
      <RffDisplayField
        name="loanProductType"
        label="Loan Product Type"
        type="select"
        data={loanDrilldown}
      />
      <RffDisplayField
        name="loanPurpose"
        label="Loan Purpose"
        type="select"
        data={loanDrilldown}
      />
      <RffDisplayField
        name="totalLoanAmount"
        label="Total Loan Amount"
        type="dollar"
        data={loanDrilldown}
      />
      <Seperator />
      <RffDisplayField
        label="Entity Name"
        value={
          isNil(loanDrilldown?.borrowerEntity?.entityName)
            ? "Not Set"
            : loanDrilldown?.borrowerEntity?.entityName
        }
        maxWidth="200px"
      />
      <RffDisplayField
        label={
          size(loanDrilldown?.borrowers) > 1
            ? `Borrowers (${size(loanDrilldown?.borrowers)})`
            : "Borrower"
        }
        value={borrowerNames}
        maxWidth="200px"
      />
      <RffDisplayField
        label={
          size(loanDrilldown?.subjectProperties) > 1
            ? `Properties (${size(loanDrilldown?.subjectProperties)})`
            : "Property"
        }
        value={propertyNames}
        maxWidth="200px"
      />

      <Seperator />
      <PermittedUsersItem />
      {/* <RffDisplayField
        label={`Permitted Users (${size(loanDrilldown?.permittedUsers)})`}
        value={permittedUsersNames}
        maxWidth="200px"
      /> */}
    </RffLoanDataGroup>
  );
});

const PermittedUsersItem = ({ children }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const { updateLoanPermittedUsers, loading } = useUnderwritingHook();
  const dispatch = useDispatch();
  const [show, setShow] = useState(false);

  const permittedUsersNames = useMemo(() => {
    const permittedUsers = loanDrilldown?.permittedUsers;
    if (isEmpty(permittedUsers)) {
      return "None";
    }

    return permittedUsers?.join(", ");
  }, [loanDrilldown?.permittedUsers]);

  const initialValues = useMemo(() => {
    return {
      permittedUsers: loanDrilldown?.permittedUsers || [],
    };
  }, [loanDrilldown?.permittedUsers]);

  const onSubmit = (values) => {
    const updatedPermittedUsers = values?.permittedUsers;
    console.log("userEmail", updatedPermittedUsers);
    // return;
    updateLoanPermittedUsers({
      loanId: loanDrilldown?._id,
      permittedUsers: updatedPermittedUsers,
      onSuccessFn: (res) => {
        dispatch(loanDrilldownSet(res));
      },
    });
  };

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <Tooltip title="Add permitted users to view this loan">
          <IconButton
            sx={{
              position: "absolute",
              right: "30px",
              top: "-5px",
              zIndex: 1,
              color: "text.secondary",
            }}
            size="small"
            onClick={() => setShow(true)}
          >
            <AddRounded fontSize="small" />
          </IconButton>
        </Tooltip>

        <RffDisplayField
          label={`Permitted Users (${size(loanDrilldown?.permittedUsers)})`}
          value={permittedUsersNames}
          maxWidth="200px"
        />
      </Box>

      <BasicModal
        show={show}
        onClose={() => setShow(false)}
        title="Permitted Users"
        maxWidth="sm"
      >
        <Flx column gap={1} sx={{ mt: 1, mb: 3 }}>
          <RffDisplayField
            label={`Current Permitted Users (${size(loanDrilldown?.permittedUsers)})`}
            value={permittedUsersNames}
            // maxWidth="200px"
          />
        </Flx>
        <Divider sx={{ mb: 3 }} />
        <RffForm
          loading={loading}
          onSubmit={onSubmit}
          submitText="Add User"
          initialValues={initialValues}
        >
          <RffGroup>
            <RffSelectMultipleUserEmailField
              name="permittedUsers"
              displayFullLabel
              label="Select user to add to loan"
            />
          </RffGroup>
        </RffForm>
      </BasicModal>
    </>
  );
};

const Seperator = ({ children }) => {
  return (
    <Divider orientation="vertical" flexItem sx={{ ml: -1, mr: 2, my: 0.1 }} />
  );
};

export default WaiverDrilldownScreen;
