import { Card, Checkbox, IconButton } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ScreenContent from "../../../../components/layout/ScreenContent";
// icons
import {
  AddOutlined,
  AttachFileOutlined,
  LocationOnOutlined,
  PeopleOutlined,
  StoreOutlined,
} from "@mui/icons-material";
import { green, grey, red } from "@mui/material/colors";
import { AgCharts } from "ag-charts-react";
import { AgGridReact } from "ag-grid-react";
import { isEmpty, isNil, size } from "lodash";
import { columnTypesBoolean } from "../../../../_src_shared/utils/agGrid/columnTypes/columnTypesBoolean";
import { columnTypesPercent } from "../../../../_src_shared/utils/agGrid/columnTypes/columnTypesPercent";
import AgGridTableWrapper from "../../../../components/agGrid/AgGridTableWrapper";
import EditableDataFieldsRenderer from "../../../../components/common/EditableDataFieldsRenderer";
import RffForm from "../../../../components/finalForm/RffForm";
import RffAddressGeolocateField from "../../../../components/finalForm/inputs/RffAddressGeolocateField";
import Flx from "../../../../components/layout/Flx";
import TitledHeaderWithSearch from "../../../../components/layout/TitledHeaderWithSearch";
import Txt from "../../../../components/typography/Txt";
import TitledCard from "../../../../components/ui/TitledCard";
import TitledGroup from "../../../../components/ui/TitledGroup";
import { loanDrilldownSidebarTypes } from "../../../../constants/enums/loanDrilldownScreenSidebarOptions";
import { selectOptionsEntityType } from "../../../../constants/selectOptions/selectOptionsEntityType";
import { selectOptionsUsaStates } from "../../../../constants/selectOptions/selectOptionsUsaStates";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import { sidebarSetValues } from "../../../../redux/actions/sidebarActions";
import LoanDrilldownTabPanel from "../LoanDrilldownTabPanel";
import LoanDocumentGroupFilesCard from "../../shared/LoanDocumentGroupFilesCard";

// your existing select options

// For any new options you need, e.g. amortizationType, interestCalcType, etc.

const LoanDrilldownEntityTab = ({ value, tab }) => {
  const [quickFilter, setQuickFilter] = useState("");
  const { updateUnnestedObject } = useUnderwritingHook();
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const dispatch = useDispatch();

  const onEntityUpdate = ({ values, stopLoadingFn }) => {
    // console.log("values", values, stopLoadingFn);

    // console.log("text", ee);
    // if (stopLoadingFn) stopLoadingFn();
    // return;
    updateUnnestedObject({
      loanId: loanDrilldown?._id,
      data: values,
      objectName: "borrowerEntity",
      onSuccessFn: (response) => {
        // console.log("response", response);
        stopLoadingFn();
        dispatch(loanDrilldownSet(response));
      },
    });
  };
  return (
    <LoanDrilldownTabPanel value={value} tab={tab}>
      <TitledHeaderWithSearch
        title={"Borrower Entity"}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
      />

      <ScreenContent maxWidth={"xl"}>
        <Flx gap={3} fw wrap sx={{ flexGrow: 1 }}>
          <Flx gap={3} fw wrap>
            <EntityDetailsGroup
              quickFilter={quickFilter}
              onUpdateFn={onEntityUpdate}
            />

            <EntityAddressSection
              quickFilter={quickFilter}
              onUpdateFn={onEntityUpdate}
            />
          </Flx>

          <EntityMembersCard
            quickFilter={quickFilter}
            onUpdateFn={onEntityUpdate}
          />
          {/* <EntityFilesCard
            quickFilter={quickFilter}
            onUpdateFn={onEntityUpdate}
          /> */}
          <LoanDocumentGroupFilesCard showIfEmpty docGroup={"Entity Docs"} />
        </Flx>

        {/* <Flx gap={3} fw wrap sx={{ flexGrow: 1 }}>
          <EntityDetailsGroup
            quickFilter={quickFilter}
            onUpdateFn={onEntityUpdate}
          />

          <EntityAddressSection
            quickFilter={quickFilter}
            onUpdateFn={onEntityUpdate}
          />
        </Flx>
        <Flx gap={3} fw wrap sx={{ flexGrow: 1, mt: 3 }}>
          <EntityMembersCard
            quickFilter={quickFilter}
            onUpdateFn={onEntityUpdate}
          />

          <EntityFilesCard
            quickFilter={quickFilter}
            onUpdateFn={onEntityUpdate}
          />
        </Flx> */}
      </ScreenContent>
    </LoanDrilldownTabPanel>
  );
};

/**
 * SECTIONS
 */

const EntityDetailsGroup = ({ quickFilter, onUpdateFn }) => {
  const borrowerEntity = useSelector(
    (state) => state.loanDrilldown?.borrowerEntity
  );

  const fields = useMemo(
    () => [
      {
        name: "entityName",
        label: "Entity Name",
        type: "text",
      },

      {
        name: "entityStateOfOrganization",
        label: "Entity State Of Organization",
        type: "select",
        options: selectOptionsUsaStates,
      },
      {
        name: "entityType",
        label: "Entity Type",
        type: "select",
        options: selectOptionsEntityType,
      },
      {
        name: "entityOrganizationDate",
        label: "Entity Organization Date",
        type: "date",
      },
      {
        name: "entityEINNumber",
        label: "Entity EIN Number",
        type: "text",
      },
      // {
      //   name: "entityMembers",
      //   label: "Entity Members",
      //   type: "text",
      // },
      {
        name: "entityGoodstandingDate",
        label: "Entity Goodstanding Date",
        type: "date",
      },
      {
        name: "entityNotes",
        label: "Entity Notes",
        type: "stringMultiline",
      },
    ],
    []
  );

  return (
    <TitledCard
      variant="h3"
      title="Entity Details"
      icon={<StoreOutlined className="thin" />}
      cardSx={{ flexGrow: 1, flexBasis: "680px", flexShrink: 1 }}
    >
      <EditableDataFieldsRenderer
        fields={fields}
        data={borrowerEntity}
        onUpdateFn={onUpdateFn}
        quickFilter={quickFilter}
      />
    </TitledCard>
  );
};

const EntityAddressSection = ({ quickFilter, onUpdateFn }) => {
  const { loading, updateUnnestedObject } = useUnderwritingHook();
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const borrowerEntity = loanDrilldown?.borrowerEntity;
  const dispatch = useDispatch();

  const entityAddress = useMemo(
    () => loanDrilldown?.borrowerEntity?.entityAddress || {},
    [loanDrilldown]
  );

  const onAddressUpdate = ({ values, stopLoadingFn }) => {
    const payload = {
      entityAddress: {
        ...entityAddress,
        ...values,
      },
    };

    updateUnnestedObject({
      loanId: loanDrilldown?._id,
      data: payload,
      objectName: "borrowerEntity",
      onSuccessFn: (response) => {
        // console.log("response", response);
        stopLoadingFn();
        dispatch(loanDrilldownSet(response));
      },
    });
  };

  const addressGroup = useMemo(() => {
    return [
      // {
      //   name: "fullAddress",
      //   label: "Full Address",
      // },
      {
        name: "streetNumber",
        label: "Street Number",
      },
      {
        name: "streetName",
        label: "Street Name",
      },
      {
        name: "city",
        label: "City",
      },
      {
        name: "state",
        label: "State",
      },
      {
        name: "zip",
        label: "Zip Code",
      },
      {
        name: "county",
        label: "County",
      },
      {
        name: "country",
        label: "Country",
      },
    ];
  }, []);

  const displayedFullAddress = useMemo(() => {
    return `${entityAddress?.streetNumber || ""} ${entityAddress?.streetName || ""}, ${entityAddress?.city || ""}, ${entityAddress?.state || ""} ${entityAddress?.zip || ""}`;
  }, [entityAddress]);

  return (
    <>
      <TitledCard
        title="Entity Address"
        icon={<LocationOnOutlined className="thin" />}
        variant="h3"
        cardSx={{ flexBasis: "420px", flexGrow: 1, flexShrink: 0 }}
      >
        {isEmpty(entityAddress) ? (
          <CreateEntityAddressContent />
        ) : (
          <>
            <Flx
              gap={0.5}
              wrap
              sx={{
                background: grey[100],
                p: 1,
                borderRadius: 2,
                mb: 2,
                mt: -0.5,
                flexGrow: 0,
              }}
            >
              <Txt bold>{displayedFullAddress}</Txt>
            </Flx>

            <EditableDataFieldsRenderer
              quickFilter={quickFilter}
              fields={addressGroup}
              data={entityAddress}
              onUpdateFn={onAddressUpdate}
            />
          </>
        )}
      </TitledCard>
    </>
  );
};

const EntityMembersCard = ({ quickFilter, onUpdateFn }) => {
  const borrowers = useSelector((state) => state.loanDrilldown?.borrowers);

  return (
    <TitledCard
      variant="h3"
      title={"Entity Members"}
      fw
      cardSx={{ flexGrow: 1, flexBasis: "500px", flexShrink: 0 }}
      icon={<PeopleOutlined className="thin" />}
    >
      <EntityOwnershipPieChart borrowers={borrowers} />
      <EntityMembersTable borrowers={borrowers} />
    </TitledCard>
  );
};

/**
 * COMPONENTS
 */

/**
 * TABLES
 */
const EntityMembersTable = ({ borrowers }) => {
  const ref = useRef();

  const rowData = useMemo(() => borrowers, [borrowers]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Name",
        valueGetter: (params) =>
          `${params.data.firstName} ${params.data.lastName}`,
        flex: 1,
        cellStyle: (params) =>
          params.node.rowPinned === "bottom" ? { fontWeight: "bold" } : {},
      },
      {
        headerName: "Is Guarantor",
        field: "isGuarantor",
        width: 120,
        cellRenderer: (params) => {
          return params.node.rowPinned === "bottom" ? null : (
            <Checkbox checked={!!params.value} disabled />
          );
        },
        type: "boolean",
      },
      {
        headerName: "Ownership %",
        type: "percent",
        aggFunc: "sum",
        width: 120,
        cellStyle: (params) => {
          // only style the pinned bottom row
          if (params.node.rowPinned === "bottom") {
            return {
              backgroundColor: params.value === 1 ? green[100] : red[100],
            };
          }
          return {};
        },
        field: "entityPercentOwnership",
      },
    ],
    []
  );

  const totalOwnership = useMemo(() => {
    return borrowers.reduce((sum, b) => {
      // guard against missing or nil
      const pct = !isNil(b.entityPercentOwnership)
        ? b.entityPercentOwnership
        : 0;
      return sum + pct;
    }, 0);
  }, [borrowers]);

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

  const columnTypes = useMemo(() => {
    return {
      ...columnTypesPercent(),
      // ...columnTypesDate(),
      // ...columnTypesDollar(),
      ...columnTypesBoolean(),
    };
  }, []);

  return (
    <AgGridTableWrapper simpleTable suppressMinHeightWhenPopulated={rowData}>
      <AgGridReact
        ref={ref}
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        columnTypes={columnTypes}
        pinnedBottomRowData={[
          {
            firstName: "Total Ownership",
            lastName: "",
            entityPercentOwnership: totalOwnership,
            // isGuarantor can be null or false here
          },
        ]}
        allowDragFromColumnsToolPanel={false}
        domLayout={"autoHeight"}
        enableCellTextSelection
      />
    </AgGridTableWrapper>
  );
};

/**
 * CHARTS
 */

const sharedPieChartOptions = {
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  height: 200,
  width: 550,
  autoSize: false,
  legend: {
    enabled: true,
    position: "right",
    item: {
      paddingX: 32,
      paddingY: 15,
      marker: {
        shape: "circle",
        size: 10,
      },
      // label: {
      //   fontSize: 12,
      // },
    },
  },
};
const EntityOwnershipPieChart = ({ borrowers }) => {
  // Transform borrowers into chart-friendly format

  const chartData = useMemo(() => {
    const validBorrowers = borrowers.filter(
      (b) =>
        b.entityPercentOwnership > 0 &&
        b.entityPercentOwnership < 1 &&
        b.isGuarantor
    );

    return validBorrowers.map((d) => ({
      name: `${d.firstName} ${d.lastName}`,
      percent: !isNil(d.entityPercentOwnership) ? d.entityPercentOwnership : 0,
      // Add formatted percentage for display
      percentFormatted: !isNil(d.entityPercentOwnership)
        ? `${(d.entityPercentOwnership * 100).toFixed(0)}%`
        : "0%",
    }));
  }, [borrowers]);

  // AG Charts options
  const options = useMemo(
    () => ({
      ...sharedPieChartOptions,
      series: [
        {
          type: "pie",
          angleKey: "percent",
          labelKey: "name",
          legendItemKey: "name",
          // calloutLabelKey: "name",
          sectorLabelKey: "percentFormatted",
        },
        // {
        //   type: "pie",
        //   angleKey: "percent",
        //   labelKey: "name",
        //   calloutLabelKey: "name",
        //   sectorLabelKey: "percentFormatted", // Use the formatted percentage
        //   label: { minAngle: 20 },
        //   showInLegend: true,
        //   tooltip: {
        //     renderer: ({ datum }) => ({
        //       content: `${datum.name}: ${(datum.percent * 100).toFixed(0)}%`,
        //     }),
        //   },
        // },
      ],
      data: chartData,
    }),
    [chartData]
  );

  if (isEmpty(borrowers) || isNil(borrowers)) {
    return;
  }

  if (size(borrowers) === 1 && borrowers[0]?.entityPercentOwnership === 0) {
    return;
  }

  return <AgCharts options={options} />;
};

const LoanDocumentsGroupFilesPieChart = ({ docGroup, loanDocuments }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    // Filter documents by the specified docGroup if provided
    const filteredDocs = docGroup
      ? loanDocuments.filter((doc) => doc.docGroup === docGroup)
      : loanDocuments;

    // Count the number of files per docType
    const docTypeCounts = filteredDocs.reduce((acc, doc) => {
      const docType = doc.docType || "Unknown";
      acc[docType] = (acc[docType] || 0) + 1;
      return acc;
    }, {});

    // Convert to array format for AG Charts
    const chartDataArray = Object.entries(docTypeCounts).map(
      ([docType, count]) => ({
        docType,
        count,
      })
    );

    setChartData(chartDataArray);
  }, [loanDocuments, docGroup]);

  const chartOptions = {
    ...sharedPieChartOptions,

    series: [
      {
        type: "pie",
        labelKey: "docType",
        legendItemKey: "docType",
        angleKey: "count",
        sectorLabelKey: "count",
        // calloutLabelKey: "docType",
        // innerRadiusRatio: 0.5,
      },
    ],
    data: chartData,
  };

  return <AgCharts options={chartOptions} />;
};

const CreateEntityAddressContent = ({ children }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const entityAddress = useMemo(
    () => loanDrilldown?.borrowerEntity?.entityAddress || {},
    [loanDrilldown]
  );
  const dispatch = useDispatch();
  const { loading, updateUnnestedObject } = useUnderwritingHook();

  const onAddressCreate = (data) => {
    let payload = {};

    if (isEmpty(entityAddress)) {
      payload = data;
    }

    // if (!isEmpty(entityAddress)){
    //   payload = entityAddress
    // }

    // return;
    updateUnnestedObject({
      loanId: loanDrilldown?._id,
      data: payload,
      objectName: "borrowerEntity",
      onSuccessFn: (response) => {
        // console.log("response", response);
        // stopLoadingFn();
        dispatch(loanDrilldownSet(response));
      },
    });
    // updateSubjectProperty({
    //   propertyId: selected?._id,
    //   loanId: loanDrilldown?._id,
    //   data: payload,
    //   onSuccessFn: (response) => {
    //     // console.log("response", response);
    //     dispatch(loanDrilldownSet(response));
    //     stopLoadingFn();
    //   },
    //   onCompleteFn: () => {
    //     stopLoadingFn();
    //   },
    // });
  };

  return (
    <RffForm
      submitText="Save Address"
      onSubmit={onAddressCreate}
      loading={loading}
      sx={{ pt: 2 }}
    >
      <RffAddressGeolocateField
        name={`entityAddress`}
        label="Enter the Entity address"
      />
    </RffForm>
  );

  return (
    <Card
      sx={{
        flexGrow: 1,
        //
        // flexBasis: "600px",
      }}
    >
      <TitledGroup
        title={"Add Entity Address"}
        icon={<AttachFileOutlined className="thin" />}
      >
        <RffForm
          submitText="Save Address"
          onSubmit={onAddressCreate}
          loading={loading}
        >
          <RffAddressGeolocateField
            name={`entityAddress`}
            label="Enter the subject property address"
          />
        </RffForm>
      </TitledGroup>
    </Card>
  );
};

export default LoanDrilldownEntityTab;
