import {
  AccountTreeOutlined,
  ListOutlined,
  PeopleOutline,
} from "@mui/icons-material";
import {
  Alert,
  Button,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { amber, yellow } from "@mui/material/colors";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import { ModuleRegistry } from "ag-grid-community";
import {
  ClipboardModule,
  ContextMenuModule,
  IntegratedChartsModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import axios from "axios";
import { isString } from "lodash";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { columnTypesBoolean } from "../../_src_shared/utils/agGrid/columnTypes/columnTypesBoolean";
import { columnTypesDate } from "../../_src_shared/utils/agGrid/columnTypes/columnTypesDate";
import AgGridTableWrapper from "../../components/agGrid/AgGridTableWrapper";
import Screen from "../../components/layout/Screen";
import TitledHeaderWithSearch from "../../components/layout/TitledHeaderWithSearch";
import BasicModal from "../../components/modals/BasicModal";
import { sideBarColumnsFilters } from "../../utils/agGrid/sideBar/sideBarColumnsFilters";
import { useNavigate } from "react-router-dom";

ModuleRegistry.registerModules([
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ContextMenuModule,
  ClipboardModule,
]);

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001/api";

const WaiverSearchScreen = () => {
  const ref = useRef();
  const [rowData, setRowData] = useState(null);
  const [quickFilter, setQuickFilter] = useState(null);
  const [selectedWaiver, setSelectedWaiver] = useState(null);
  const [showWaiverModal, setShowWaiverModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [treeData, setTreeData] = useState(false);
  const [error, setError] = useState(null);

  // Fetch waiver data on component mount
  useEffect(() => {
    fetchWaivers();
  }, []);

  const fetchWaivers = async (searchQuery = "") => {
    setLoading(true);
    setError(null);

    console.log("Fetch");
    try {
      // Fixed: Added /waivers to the path
      // const response = await axios.get(`${API_BASE_URL}/api/waivers/debug/raw`);
      const response = await axios.get(`${API_BASE_URL}/api/waivers/users/all`);

      if (response.data.success) {
        console.log("fetchWaivers => response.data", response.data);

        // Transform the data to match what AG Grid expects
        const transformedData = response.data.data.map((participant) => ({
          id: participant.id,
          waiverId: participant.lastWaiverId,
          name: participant.fullName,
          firstName: participant.firstName,
          lastName: participant.lastName,
          dateOfBirth: participant.dateOfBirth,
          dateSigned: participant.lastSigned,
          signingAdult: "", // This will be populated for minors in the full waiver data
          participantType: participant.type,
          age: participant.age,
          totalWaivers: participant.totalWaivers,
          waiverIds: participant.waiverIds,
        }));

        setRowData(response.data.data);
        // setRowData(transformedData);
      } else {
        setError("Failed to fetch waivers");
      }
    } catch (err) {
      console.error("Error details:", err);
      setError("Error fetching waivers: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = async (waiverId) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/waivers/${waiverId}`
      );
      if (response.data.success) {
        setSelectedWaiver(response.data.data);
        setShowWaiverModal(true);
      }
    } catch (err) {
      setError("Error fetching waiver details: " + err.message);
    }
  };

  // Search functionality
  const searchWaivers = async (searchQuery) => {
    if (!searchQuery) {
      fetchWaivers();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/waivers/users/search`,
        {
          params: { query: searchQuery },
        }
      );

      if (response.data.success) {
        const transformedData = response.data.data.map((participant) => ({
          id: participant.id,
          waiverId: participant.lastWaiverId,
          name: participant.fullName,
          firstName: participant.firstName,
          lastName: participant.lastName,
          dateOfBirth: participant.dateOfBirth,
          dateSigned: participant.lastSigned,
          signingAdult: "",
          participantType: participant.type,
          age: participant.age,
          matchedOn: participant.matchedOn,
        }));

        setRowData(transformedData);
      } else {
        setError("Failed to search waivers");
      }
    } catch (err) {
      setError("Error searching waivers: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search
  // useEffect(() => {
  //   const delayDebounceFn = setTimeout(() => {
  //     if (quickFilter !== null) {
  //       searchWaivers(quickFilter);
  //     }
  //   }, 500);

  //   return () => clearTimeout(delayDebounceFn);
  // }, [quickFilter]);
  const navigate = useNavigate();
  return (
    <Screen sx={{ background: "#faf9f5" }}>
      <TitledHeaderWithSearch
        // title={"Waivers"}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        endContent={
          // <ToggleButtonGroup
          //   value={treeData}
          //   exclusive
          //   onChange={(e, nv) => setTreeData(nv)}
          //   aria-label="text alignment"
          // >
          //   <ToggleButton value={false} aria-label="left aligned">
          //     <ListOutlined />
          //   </ToggleButton>
          //   <ToggleButton value={true} aria-label="centered">
          //     <AccountTreeOutlined className="thin" />
          //   </ToggleButton>
          // </ToggleButtonGroup>
          <Button
            onClick={() => navigate("/waiver")}
            endIcon={<PeopleOutline />}
          >
            Waiver Form
          </Button>
        }
      />

      {error && <Alert severity="error">{error}</Alert>}

      <WaiverPreviewModal
        show={showWaiverModal}
        waiver={selectedWaiver}
        onClose={() => {
          setShowWaiverModal(false);
          setSelectedWaiver(null);
        }}
      />

      {loading ? (
        <div
          style={{ display: "flex", justifyContent: "center", padding: "20px" }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <WaiverSearchTable
            ref={ref}
            rowData={rowData}
            treeData={treeData}
            quickFilterText={quickFilter}
            onRowClick={handleRowClick}
          />
        </>
      )}
    </Screen>
  );
};

const WaiverSearchTable = forwardRef(
  ({ rowData, quickFilterText, treeData, onRowClick }, ref) => {
    const sideBar = useMemo(() => sideBarColumnsFilters(), []);

    // Transform the data to create a tree structure
    const transformedRowData = useMemo(() => {
      if (!rowData) return [];

      const result = [];
      const adultsMap = new Map();

      // First pass - create adult entries
      rowData.forEach((participant) => {
        if (participant.type === "adult") {
          const adultEntry = {
            ...participant,
            orgHierarchy: [participant.fullName], // Tree structure path
            children: [],
            isParent: false, // Will be updated if they have minors
          };
          adultsMap.set(participant.id, adultEntry);
          result.push(adultEntry);
        }
      });

      // Second pass - attach minors to their signing adults
      rowData.forEach((participant) => {
        if (participant.type === "minor" && participant.signingAdultId) {
          const signingAdult = adultsMap.get(participant.signingAdultId);
          if (signingAdult) {
            // Mark adult as parent
            signingAdult.isParent = true;

            // Create minor entry with tree structure
            const minorEntry = {
              ...participant,
              orgHierarchy: [signingAdult.fullName, participant.fullName],
              isChild: true,
            };

            signingAdult.children.push(minorEntry);
            result.push(minorEntry);
          } else {
            // If no signing adult found, add as standalone
            result.push({
              ...participant,
              orgHierarchy: [participant.fullName],
            });
          }
        }
      });

      return result;
    }, [rowData]);

    const columnDefs = useMemo(
      () => [
        {
          headerName: "Name",
          field: "fullName",
          filter: true,
          // hide: true, // Hide since this info is now shown in hierarchy
          flex: 1,
          // cellRenderer: "agGroupCellRenderer",
          // cellRendererParams: {
          //   suppressCount: true,
          //   suppressDoubleClickExpand: true,
          //   checkbox: false,
          // },
        },
        {
          headerName: "Last Signed",
          field: "lastSigned",
          sort: "desc",
          filter: "agDateColumnFilter",
          valueFormatter: (params) => {
            if (params.value) {
              return new Date(params.value).toLocaleDateString();
            }
            return "";
          },
          flex: 1,
        },
        {
          headerName: "Date of Birth",
          field: "dateOfBirth",
          filter: "agDateColumnFilter",
          valueFormatter: (params) => {
            if (params.value) {
              return new Date(params.value).toLocaleDateString();
            }
            return "";
          },
          flex: 1,
        },
        {
          headerName: "Signing Adult",
          field: "signingAdultName",
          filter: true,
          flex: 1,
          // hide: true, // Hide since this info is now shown in hierarchy
        },

        {
          headerName: "Age",
          field: "age",
          filter: "agNumberColumnFilter",
          // flex: 0.5,
        },
        {
          headerName: "Total Waivers",
          field: "totalWaivers",
          filter: "agNumberColumnFilter",
          hide: true, // Hide since this info is now shown in hierarchy
          // flex: 0.8,
        },
        {
          headerName: "Type",
          field: "type",
          filter: true,
          valueFormatter: (params) => {
            if (!isString(params.value)) {
              return "";
            }
            return params.value.charAt(0).toUpperCase() + params.value.slice(1);
          },
        },
        {
          headerName: "Waivers",
          field: "waiverIds",
          hide: true, // Hide since this info is now shown in hierarchy
          filter: "agNumberColumnFilter",
          // flex: 0.8,
        },
      ],
      []
    );

    const autoGroupColumnDef = useMemo(
      () => ({
        headerName: "Participants",
        minWidth: 200,
        flex: 1,
        cellRendererParams: {
          suppressCount: true,
          checkbox: false,
          innerRenderer: (params) => {
            return params.data?.fullName || "";
          },
        },
      }),
      []
    );

    const columnTypes = useMemo(() => {
      return {
        ...columnTypesDate(),
        ...columnTypesBoolean(),
      };
    }, []);

    const onCellClicked = useCallback(
      (params) => {
        if (params.data && params.data.waiverId) {
          onRowClick(params.data.waiverId);
        }
      },
      [onRowClick]
    );

    const getRowStyle = useCallback(
      (params) => {
        if (params.data?.type === "minor") {
          return {
            backgroundColor: yellow[50],
            borderLeft: `4px solid ${amber[400]}`,
            // marginLeft: "20px", // Additional indentation for minors
          };
        }

        if (!treeData) {
          return;
        }
        if (params.data?.isParent) {
          return {
            borderLeft: `4px solid #ffffff`,
            fontWeight: "bold",
            backgroundColor: "#f8f9fa",
          };
        }
        return {
          borderLeft: `4px solid #ffffff`,
        };
      },
      [treeData]
    );

    const onFirstDataRendered = useCallback((params) => {
      // Auto-expand all parent rows to show minors by default
      params.api.forEachNode((node) => {
        if (node.group && node.data?.isParent) {
          node.setExpanded(true);
        }
      });
      // agApiSizeColumnsToFit(params);
      // params?.api?.autoSizeAllColumns();
      // params?.api?.autoSizeAllColumns();
    }, []);

    const defaultColDef = useMemo(
      () => ({
        sortable: true,
        resizable: true,
        floatingFilter: false,
        filter: true,
        minWidth: 140,
      }),
      []
    );

    // Tree data configuration
    const getDataPath = useCallback((data) => {
      return data.orgHierarchy;
    }, []);

    return (
      <AgGridTableWrapper
        noBorderRadius
        noBorder
        //
        height={"100%"}
        size={4}
      >
        <AgGridReact
          ref={ref}
          rowData={transformedRowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onFirstDataRendered={onFirstDataRendered}
          // Tree Data Configuration
          treeData={treeData}
          getDataPath={getDataPath}
          autoGroupColumnDef={autoGroupColumnDef}
          groupDefaultExpanded={1}
          onCellClicked={onCellClicked}
          columnTypes={columnTypes}
          quickFilterText={quickFilterText}
          // rowGroupPanelShow={"always"}
          sideBar={sideBar}
          cellSelection={true}
          getRowStyle={getRowStyle}
          animateRows={true}
          pagination={true}
          paginationPageSize={20}
          // Additional tree configuration
          suppressAggFuncInHeader={true}
          suppressRowClickSelection={true}
        />
      </AgGridTableWrapper>
    );
  }
);

const WaiverPreviewModal = ({ show, waiver, onClose }) => {
  if (!waiver) return null;

  return (
    <BasicModal
      maxWidth={"md"}
      title={`Waiver Details - ${waiver.waiverId}`}
      show={show}
      onClose={onClose}
    >
      <div style={{ padding: "20px" }}>
        <h3>Waiver Information</h3>
        <p>
          <strong>Submission Date:</strong>{" "}
          {new Date(waiver.submissionDate).toLocaleString()}
        </p>
        <p>
          <strong>Participation Type:</strong> {waiver.participationType}
        </p>
        <p>
          <strong>Total Participants:</strong> {waiver.totalParticipants}
        </p>
        <p>
          <strong>Adults:</strong> {waiver.adultCount} |{" "}
          <strong>Minors:</strong> {waiver.minorCount}
        </p>

        <h3 style={{ marginTop: "20px" }}>Participants</h3>
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {waiver.participants.map((participant, index) => (
            <div
              key={participant.id}
              style={{
                padding: "10px",
                border: "1px solid #ddd",
                marginBottom: "10px",
                borderRadius: "4px",
                backgroundColor:
                  participant.type === "minor" ? "#f0f8ff" : "#f5f5f5",
              }}
            >
              <p>
                <strong>{participant.fullName}</strong> ({participant.type})
              </p>
              <p>
                Date of Birth:{" "}
                {new Date(participant.dateOfBirth).toLocaleDateString()}
              </p>
              <p>Age: {participant.age}</p>
              {participant.type === "minor" && (
                <p>Signed by: {participant.signingAdultName}</p>
              )}
              {participant.isSigningAdult && (
                <p>
                  Signed for:{" "}
                  {participant.minorsSignedFor.map((m) => m.name).join(", ")}
                </p>
              )}
            </div>
          ))}
        </div>

        <Button fullWidth variant="contained" sx={{ mt: 3 }} onClick={onClose}>
          Close
        </Button>
      </div>
    </BasicModal>
  );
};

export default WaiverSearchScreen;
