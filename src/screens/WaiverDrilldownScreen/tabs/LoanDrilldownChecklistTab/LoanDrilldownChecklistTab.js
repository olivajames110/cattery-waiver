import {
  Box,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Grid2,
} from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import RffLoanDataGroup from "../../../../components/finalForm/shared/RffLoanDataGroup";
import ScreenContent from "../../../../components/layout/ScreenContent";
import TitledCard from "../../../../components/ui/TitledCard";
// icons
import EditableDataFieldsRenderer from "../../../../components/common/EditableDataFieldsRenderer";
import RffBooleanCheckbox from "../../../../components/finalForm/inputs/RffBooleanCheckbox";
import { selectOptionsUwChecklistStatus } from "../../../../constants/selectOptions/selectOptionsUwChecklistStatus";
import TableClickthroughSection from "../../shared/TableClickthroughSection";
import LoanDrilldownTabPanel from "../LoanDrilldownTabPanel";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import Flx from "../../../../components/layout/Flx";
import { grey } from "@mui/material/colors";
import SearchInputLight from "../../../../components/inputs/SearchInputLight";
import { isFunction, isNil, over } from "lodash";
import ScreenHeader from "../../../../components/layout/ScreenHeader";
import TitledHeaderWithSearch from "../../../../components/layout/TitledHeaderWithSearch";
// your existing select options

// For any new options you need, e.g. amortizationType, interestCalcType, etc.

const LoanDrilldownChecklistTab = ({ value, tab, includedInSidebar }) => {
  const [quickFilter, setQuickFilter] = useState(null);

  if (includedInSidebar) {
    return (
      <Flx
        column
        sx={{
          // background: grey[100],
          p: 2,
          height: "100%",
          justifyContent: "flex-start",
          overflowY: "auto",
        }}
        gap={3}
      >
        <SearchInputLight
          value={quickFilter}
          placeholder="Search in checklist..."
          onChange={setQuickFilter}
          sx={{ flexGrow: 0, input: { padding: 0 } }}
        />
        <DatesCard quickFilter={quickFilter} />
        <UwStatusCard
          quickFilter={quickFilter}
          includedInSidebar={includedInSidebar}
        />
      </Flx>
    );
  }
  return (
    <LoanDrilldownTabPanel value={value} tab={tab}>
      <TitledHeaderWithSearch
        title={"Underwriting Checklist"}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        variant="h2"
        endContent={<UwCompletedCheckbox />}
      />

      <ScreenContent
        maxWidth={"xl"}
        // suppressPaddingTop
        suppressPaddingLeftRight
      >
        <Flx gap={3} fw wrap justifyContent="flex-start" id="checklist-grid">
          <UwStatusCard quickFilter={quickFilter} />

          <DatesCard quickFilter={quickFilter} />
        </Flx>
      </ScreenContent>
    </LoanDrilldownTabPanel>
  );
};

const UwCompletedCheckbox = ({ children }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const { loading, updateUnnestedObject } = useUnderwritingHook();
  const dispatch = useDispatch();
  const [checked, setChecked] = useState(
    loanDrilldown?.underwritingCheckList?.initialUnderwritingIsCompletedStatus
  );
  const onUpdateFn = (e) => {
    const value = e.target.checked;
    console.log("value", value);
    setChecked(value);
    // return;
    updateUnnestedObject({
      objectName: "underwritingCheckList",
      loanId: loanDrilldown?._id,
      data: { initialUnderwritingIsCompletedStatus: value },
      onSuccessMsg: "Checklist updated successfully",
      onSuccessFn: (d) => {
        dispatch(loanDrilldownSet(d));
      },
      onFailFn: () => {
        setChecked(!value);
      },
    });
  };
  return (
    <FormControlLabel
      sx={{
        flexGrow: 0,
        span: {
          fontSize: "13px !important",
        },
      }}
      control={
        loading ? (
          <CircularProgress size={13} sx={{ mr: 1 }} />
        ) : (
          <Checkbox
            loading
            // defaultChecked={loanDrilldown?.initialUnderwritingIsCompletedStatus}
            checked={checked}
            size="small"
            onChange={onUpdateFn}
          />
        )
      }
      label={"Initial Underwriting Is Completed Status"}
    />
  );
};

const DatesCard = ({ quickFilter }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const { updateUnnestedObject } = useUnderwritingHook();
  const dispatch = useDispatch();

  const onUpdateFn = ({ values, stopLoadingFn }) => {
    updateUnnestedObject({
      objectName: "underwritingCheckList",
      loanId: loanDrilldown?._id,
      data: values,
      onSuccessMsg: "Checklist updated successfully",
      onSuccessFn: (d) => {
        dispatch(loanDrilldownSet(d));
      },
      onCompleteFn: () => {
        stopLoadingFn();
      },
    });
  };
  const fields = useMemo(
    () => [
      {
        name: "appraisalDate",
        label: "Appraisal Date",
        type: "date",
      },
      {
        name: "creditReportDate",
        label: "Credit Report Date",
        type: "date",
      },
      {
        name: "backgroundReportDate",
        label: "Background Report Date",
        type: "date",
      },
      {
        name: "certificateOfGoodStandingDate",
        label: "Certificate Of Good Standing Date",
        type: "date",
      },
      {
        name: "identificationExpirationDate",
        label: "Identification Expiration Date",
        type: "date",
      },
      {
        name: "lastBankStatementEndDate",
        label: "Last Bank Statement End Date",
        type: "date",
      },
      {
        name: "ofacReportDate",
        label: "Ofac Report Date",
        type: "date",
      },
      {
        name: "payoffLetterGoodThroughDate",
        label: "Payoff Letter Good Through Date",
        type: "date",
      },
      {
        name: "rentalLeaseExpirationDate",
        label: "Rental Lease Expiration Date",
        type: "date",
      },
    ],
    []
  );

  return (
    <TitledCard
      variant="h3"
      title="Dates"
      cardSx={{
        flexBasis: "auto",
        flexShrink: 0,
        flexGrow: 0,
        height: "max-content",
      }}
    >
      <EditableDataFieldsRenderer
        quickFilter={quickFilter}
        fields={fields}
        onUpdateFn={onUpdateFn}
        data={loanDrilldown?.underwritingCheckList}
      />
    </TitledCard>
  );
};

//
// UW STATUS COMPONENT
//
const UwStatusCard = ({ quickFilter, includedInSidebar }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const { updateUnnestedObject } = useUnderwritingHook();
  const dispatch = useDispatch();
  const gridRef = useRef();

  const selectType = useMemo(() => {
    if (includedInSidebar) {
      return "select";
    }
    return "selectToggle";
    // if (isNil(gridRef.current) || includedInSidebar) {
    //   return "select";
    // }
    // const innerWidth = gridRef.current.getBoundingClientRect().width;

    // if (innerWidth < 700) {
    //   return "select";
    // } else {
    //   return "selectToggle";
    // }
  }, [includedInSidebar]);

  const onUpdateFn = ({ values, stopLoadingFn }) => {
    updateUnnestedObject({
      objectName: "underwritingCheckList",
      loanId: loanDrilldown?._id,
      data: values,
      onSuccessFn: (d) => {
        dispatch(loanDrilldownSet(d));
      },
      onCompleteFn: () => {
        stopLoadingFn();
      },
    });
  };

  const fields = useMemo(() => {
    // const cellSize = 8;
    const cellSize = includedInSidebar ? 6 : 9;
    return [
      // docCollectionStatus (unique options)
      {
        name: "docCollectionStatus",
        label: "Doc Collection Status",
        type: selectType,
        cellValueSize: cellSize,
        options: ["In Process", "Completed"],
      },
      // verificationOfMortgageStatus
      {
        name: "verificationOfMortgageStatus",
        label: "Verification Of Mortgage Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      // appraisalReportStatus (unique options)
      {
        name: "appraisalReportStatus",
        label: "Appraisal Report Status",
        type: selectType,
        cellValueSize: cellSize,
        options: ["Not Ordered", "Ordered"],
      },
      // backgroundReportStatus
      {
        name: "backgroundReportStatus",
        label: "Background Report Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "closingPackageStatus",
        label: "Closing Package Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "condoQuestionnaireStatus",
        label: "Condo Questionnaire Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "creditAuthStatus",
        label: "Credit Auth Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "creditReportStatus",
        label: "Credit Report Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "entityDocsStatus",
        label: "Entity Docs Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "enviornmentalReportStatus",
        label: "Enviornmental Report Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "estoppelLetterReportStatus",
        label: "Estoppel Letter Report Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "experienceDocsStatus",
        label: "Experience Docs Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "floodCertificateStatus",
        label: "Flood Certificate Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "feasibilityReportStatus",
        label: "Feasibility Report Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "loanApplicationStatus",
        label: "Loan Application Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "hoaDuesStatus",
        label: "Hoa Dues Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "identificationStatus",
        label: "Identification Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "insuranceDocsStatus",
        label: "Insurance Docs Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "liquidityDocsStatus",
        label: "Liquidity Docs Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "managementAgreementStatus",
        label: "Management Agreement Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "managementQuestionnaireStatus",
        label: "Management Questionnaire Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "ofacReportStatus",
        label: "Ofac Report Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "payoffLetterStatus",
        label: "Payoff Letter Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "preliminaryTitleStatus",
        label: "Preliminary Title Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "preliminaryHudStatus",
        label: "Preliminary Hud Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "proofOfRentStatus",
        label: "Proof Of Rent Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "purchaseContractStatus",
        label: "Purchase Contract Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "purchaseHudStatus",
        label: "Purchase Hud Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "rehabBudgetStatus",
        label: "Rehab Budget Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "rentalLeaseStatus",
        label: "Rental Lease Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "secondaryValuationStatus",
        label: "Secondary Valuation Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
      {
        name: "vomStatus",
        label: "Vom Status",
        type: selectType,
        cellValueSize: cellSize,
        options: selectOptionsUwChecklistStatus,
      },
    ];
  }, [selectType, includedInSidebar]);

  useEffect(() => {
    console.log("gridRef", gridRef.current.getBoundingClientRect().width);
  }, []);
  return (
    <TitledCard
      variant="h3"
      title="Status Checklist"
      cardSx={{ flexBasis: "500px", flexShrink: 0, flexGrow: 1 }}
    >
      <Box ref={gridRef}>
        <RffLoanDataGroup
          column
          initialValues={loanDrilldown}
          id="checklist-grid"
        >
          <EditableDataFieldsRenderer
            quickFilter={quickFilter}
            fields={fields}
            onUpdateFn={onUpdateFn}
            data={loanDrilldown?.underwritingCheckList}
          />
        </RffLoanDataGroup>
      </Box>
    </TitledCard>
  );
};

// const EditableDataFieldsRenderer = ({ quickFilter, fields }) => {
//   const filteredFields = useMemo(() => {
//     // If quickFilter is empty or just whitespace, return all fields
//     if (!quickFilter?.trim()) {
//       return fields;
//     }

//     const lowerFilter = quickFilter.toLowerCase();
//     return fields.filter(
//       (field) =>
//         field?.name?.toLowerCase()?.includes(lowerFilter) ||
//         field?.label?.toLowerCase()?.includes(lowerFilter)
//     );
//   }, [quickFilter, fields]);

//   // If there are no fields matching the filter, you can return null or
//   // a small message like "No fields found."
//   if (!filteredFields.length) {
//     return <Txt sx={{ opacity: 0.45 }}>No fields found</Txt>;
//   }

//   return filteredFields.map((f) => (
//     <EditableDataRow
//       key={f.name}
//       name={f.name}
//       cellValueSize={f?.cellValueSize}
//       label={f.label}
//       type={f.type}
//       toggleSize="xs"
//       options={f?.options}
//     />
//   ));
// };

export default LoanDrilldownChecklistTab;
