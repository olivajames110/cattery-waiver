import { Box, useTheme } from "@mui/material";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import RffLoanDataGroup from "../../../../components/finalForm/shared/RffLoanDataGroup";
import Flx from "../../../../components/layout/Flx";
import ScreenContent from "../../../../components/layout/ScreenContent";
import Txt from "../../../../components/typography/Txt";
import TitledCard from "../../../../components/ui/TitledCard";
// icons
import {
  CurrencyExchangeOutlined,
  DoDisturbOutlined,
  GavelOutlined,
  InfoOutlined,
  PointOfSaleOutlined,
} from "@mui/icons-material";
import { isEqual } from "lodash";
import EditableDataFieldsRenderer from "../../../../components/common/EditableDataFieldsRenderer";
import TitledHeaderWithSearch from "../../../../components/layout/TitledHeaderWithSearch";
import { selectOptionsAmortizationType } from "../../../../constants/selectOptions/selectOptionsAmortizationType";
import { selectOptionsInterestCalcType } from "../../../../constants/selectOptions/selectOptionsInterestCalcType";
import { selectOptionsLoanProductType } from "../../../../constants/selectOptions/selectOptionsLoanProductType";
import { selectOptionsLoanPurpose } from "../../../../constants/selectOptions/selectOptionsLoanPurpose";
import { selectOptionsPrepaymentPenaltyStructure } from "../../../../constants/selectOptions/selectOptionsPrepaymentPenaltyStructure";
import { selectOptionsVomPaymentHistory } from "../../../../constants/selectOptions/selectOptionsVomPaymentHistory";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import { loanPipelineClear } from "../../../../redux/actions/loanPipelineActions";
import { selectOptionsPipelineType } from "../../../../constants/selectOptions/selectOptionsPipelineType";
// your existing select options

const SECTION_DEFINITIONS = [
  { id: "loanMeta", label: "Loan Meta" },
  { id: "loanTerms", label: "Loan Terms" },

  { id: "refinanceInfo", label: "Refinance Info" },
  { id: "prepayment", label: "Prepayment" },
  { id: "deadDeal", label: "Dead Deal" },
];

// For any new options you need, e.g. amortizationType, interestCalcType, etc.

const LoanDrilldownDetailsTab = () => {
  const [quickFilter, setQuickFilter] = useState("");
  const theme = useTheme();
  return (
    <>
      <TitledHeaderWithSearch
        title={"Loan Information"}
        quickFilter={quickFilter}
        setQuickFilter={setQuickFilter}
        searchPlaceholder={"Search in loan..."}
        sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}
      />
      <ScreenContent
        sx={{
          flexGrow: 1,
          width: "100%",
          maxWidth: "1440px",

          margin: "0px auto",
        }}
      >
        <LoanContentsSection quickFilter={quickFilter} />
      </ScreenContent>
    </>
  );
};

const LoanContentsSection = ({ quickFilter }) => {
  // Refs for each section
  const theme = useTheme();
  const sectionRefs = useRef({});
  SECTION_DEFINITIONS.forEach((sec) => {
    sectionRefs.current[sec.id] = React.createRef();
  });

  // The ID of the section currently in view
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    // 1) Grab the container
    const scrollContainer = document.getElementById("overflow-root");
    if (!scrollContainer) {
      console.error("Could not find #overflow-root container.");
      return;
    }

    // 2) Intersection Observer callback
    const onIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    // 3) Intersection Observer options
    const observerOptions = {
      root: scrollContainer, // <--- the custom scroll container
      rootMargin: "0px 0px -50% 0px",
      threshold: 0.3,
    };

    const observer = new IntersectionObserver(onIntersect, observerOptions);

    // Observe each section
    SECTION_DEFINITIONS.forEach((sec) => {
      const el = sectionRefs.current[sec.id].current;
      if (el) observer.observe(el);
    });

    // Cleanup on unmount
    return () => {
      SECTION_DEFINITIONS.forEach((sec) => {
        const el = sectionRefs.current[sec.id].current;
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // 4) On click => manually scroll the container to that section
  const handleNavClick = (sectionId) => {
    const scrollContainer = document.getElementById("overflow-root");
    const targetEl = sectionRefs.current[sectionId]?.current;
    if (!scrollContainer || !targetEl) return;

    // Optional #1: Try using scrollIntoView. Depending on the browser,
    // you can pass { behavior: 'smooth', block: 'start' }
    // but we also must ensure the container is "scrollable" and that
    // `overflow-root`'s children can accept it:
    //
    // targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    //
    // If that doesn't work, do the manual offset approach below.

    // Optional #2: Manual offset approach
    const containerRect = scrollContainer.getBoundingClientRect();
    const elementRect = targetEl.getBoundingClientRect();
    const offset =
      elementRect.top - containerRect.top + scrollContainer.scrollTop;

    scrollContainer.scrollTo({
      top: offset,
      behavior: "smooth",
    });
  };

  return (
    <Flx
      sx={{
        position: "relative",
        // mt: 6,
        // pt: 6,
        // borderTop: `1px solid ${grey[200]}`,
      }}
      gap={3}
    >
      {/* MAIN COLUMN: the actual card sections */}
      <Flx column gap={3} sx={{ flexGrow: 1 }}>
        {/* <Flx fw jb ac gap={6}>
          <Htag sx={{ color: "var(--titleColor)" }}>Loan Information</Htag>
          <SearchInput
            value={quickFilter}
            shape="round"
            variant="outlined"
            // variant="paper"
            // variant="paper"
            rounded
            sx={{ flexGrow: 1 }}
            onChange={setQuickFilter}
            placeholder="Search in loan..."
          />
        </Flx> */}

        <Box id="loanMeta" ref={sectionRefs.current["loanMeta"]}>
          <LoanMetaCard quickFilter={quickFilter} />
        </Box>
        <Box id="loanTerms" ref={sectionRefs.current["loanTerms"]}>
          <LoanTermsCard quickFilter={quickFilter} />
        </Box>

        <Box id="refinanceInfo" ref={sectionRefs.current["refinanceInfo"]}>
          <RefinanceInfoCard quickFilter={quickFilter} />
        </Box>

        <Box id="prepayment" ref={sectionRefs.current["prepayment"]}>
          <PrepaymentCard quickFilter={quickFilter} />
        </Box>

        <Box id="deadDeal" ref={sectionRefs.current["deadDeal"]}>
          <DeadDealCard quickFilter={quickFilter} />
        </Box>
      </Flx>

      {/* STICKY NAV ON THE RIGHT */}
      <Box
        sx={{
          position: "sticky",
          top: 14,
          right: 0,
          width: "200px",
          zIndex: 110,
          height: "100%",
          pl: 1,
          pr: 1,
        }}
      >
        <Flx column>
          <Txt
            sx={{
              color: "#576375",
              fontSize: "11px",
              letterSpacing: "1.6px",
              mb: 2,
            }}
          >
            LOAN CONTENTS
          </Txt>

          {SECTION_DEFINITIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <Txt
                key={sec.id}
                onClick={() => handleNavClick(sec.id)}
                sx={{
                  cursor: "pointer",
                  // mb: 1,
                  fontWeight: isActive ? 700 : 600,
                  color: isActive
                    ? theme.palette.primary.main
                    : "rgba(0, 0, 0, 0.54)",
                  textDecoration: isActive ? "underline" : "none",
                  flexShrink: 0,
                  paddingLeft: "8px",
                  fontSize: "12.8px",
                  paddingRight: "8px",
                  minHeight: "36px",
                  WebkitBoxAlign: "center",
                  alignItems: "center",
                  WebkitBoxPack: "start",
                  justifyContent: "flex-start",
                  textAlign: "left",
                  textTransform: "capitalize",
                }}
              >
                {sec.label}
              </Txt>
            );
          })}
        </Flx>
      </Box>
    </Flx>
  );
};

/**
 * Loan Contents cards
 */

const LoanMetaCard = ({ quickFilter }) => {
  const fields = useMemo(
    () => [
      {
        name: "loanName",
        label: "Loan Name",
        type: "text",
      },
      // {
      //   name: "loanStatus",
      //   label: "Loan Status",
      //   type: "select",
      //   options: selectOptionsLoanStatus,
      // },

      {
        name: "loanProductType",
        label: "Loan Product Type",
        type: "select",
        options: selectOptionsLoanProductType,
      },
      {
        name: "loanPurpose",
        label: "Loan Purpose",
        type: "select",
        options: selectOptionsLoanPurpose,
      },

      {
        name: "isTableFunding",
        label: "Is Table Funding?",
        type: "booleanToggle",
      },
      {
        name: "isBalanceSheetClosing",
        label: "Is Balance Sheet Closing?",
        type: "booleanToggle",
      },
      {
        name: "createDateTime",
        label: "Create Date Time",
        type: "date",
        disabled: true,
      },
      {
        name: "updateDateTime",
        label: "Update Date Time",
        type: "date",
        disabled: true,
      },
      {
        name: "loanNumber",
        label: "Loan Number",

        disabled: true,
      },
      {
        name: "exitStrategy",
        label: "Exit Strategy",
        type: "stringMultiline",
      },
      {
        name: "dscr",
        label: "The DSCR for the loan as measured by counterparty",
        type: "float",
      },
      {
        name: "totalInPlaceRents",
        label: "Total In Place Rents",
        type: "dollar",
      },
      {
        name: "totalMarketRents",
        label: "Total Market Rents",
        type: "dollar",
      },
      {
        name: "pipeline",
        label: "Current Pipeline",
        type: "select",
        options: selectOptionsPipelineType,
      },
      // {
      //   name: "assetId",
      //   label: "Asset Id",
      //   type: "text",
      //   disabled: true,
      // },
    ],
    []
  );

  return (
    <FilterableLoanDataCard
      title="Loan Meta"
      fields={fields}
      icon={<InfoOutlined className="thin" />}
      quickFilter={quickFilter}
    />
  );
};

const LoanTermsCard = ({ quickFilter }) => {
  const fields = useMemo(
    () => [
      {
        name: "baseLoanAmount",
        label: "Base Loan Amount",
        type: "dollar",
      },
      {
        name: "totalHoldback",
        label: "Total Holdback",
        type: "dollar",
      },
      {
        name: "originationDate",
        label: "Origination Date",
        type: "date",
      },
      {
        name: "fundedDate",
        label: "Funded Date",
        type: "date",
      },
      {
        name: "maturityDate",
        label: "Maturity Date",
        type: "date",
      },
      {
        name: "expectedClosingDate",
        label: "Expected Closing Date",
        type: "date",
      },
      {
        name: "applicationFeeDate",
        label: "Application Fee Date",
        type: "date",
      },
      {
        name: "closingScheduled",
        label: "Closing Scheduled?",
        type: "booleanToggle",
      },
      {
        name: "closingScheduledDate",
        label: "Closing Scheduled Date",
        type: "date",
      },
      {
        name: "interestRate",
        label: "Interest Rate",
        type: "percent",
      },
      {
        name: "discountPoints",
        label: "Discount Points",
        type: "percent",
      },
      {
        name: "originationPoints",
        label: "Origination Points",
        type: "percent",
      },
      {
        name: "floatingRateLoan",
        label: "Floating Rate Loan?",
        type: "booleanToggle",
      },
      {
        name: "floatingRateLoanBaseRate",
        label: "Floating Rate Base Rate",
        type: "percent",
      },
      {
        name: "floatingRateLoanFloorRate",
        label: "Floating Rate Floor Rate",
        type: "percent",
      },
      {
        name: "floatingRateLoanCapRate",
        label: "Floating Rate Cap Rate",
        type: "percent",
      },
      {
        name: "floatingRateLoanRateIndex",
        label: "Floating Rate Index",
        type: "text",
      },
      {
        name: "floatingRateLoanRateMargin",
        label: "Floating Rate Margin",
        type: "percent",
      },
      {
        name: "closingFees",
        label: "Closing Fees",
        type: "text",
      },
    ],
    []
  );

  return (
    <FilterableLoanDataCard
      title="Loan Terms"
      fields={fields}
      icon={<GavelOutlined className="thin" />}
      quickFilter={quickFilter}
    />
  );
};

const RefinanceInfoCard = ({ quickFilter }) => {
  const fields = useMemo(
    () => [
      {
        name: "refinancingAssetId",
        label: "Refinancing Asset Id",
        type: "text",
      },
      {
        name: "closingAsEntity",
        label: "Closing As Entity?",
        type: "booleanToggle",
      },
      {
        name: "amortizationType",
        label: "Amortization Type",
        type: "select",
        options: selectOptionsAmortizationType,
      },
      {
        name: "interestCalcType",
        label: "Interest Calc Type",
        type: "select",
        options: selectOptionsInterestCalcType,
      },
      {
        name: "outstandingLoanUpb",
        label: "Outstanding Loan UPB",
        type: "dollar",
      },
      {
        name: "exisitingLender",
        label: "Existing Lender",
        type: "text",
      },
    ],
    []
  );

  return (
    <FilterableLoanDataCard
      title="Refinance Info"
      fields={fields}
      icon={<CurrencyExchangeOutlined className="thin" />}
      quickFilter={quickFilter}
    />
  );
};

const PrepaymentCard = ({ quickFilter }) => {
  const fields = useMemo(
    () => [
      {
        name: "vomPaymentHistory",
        label: "VOM Payment History",
        type: "select",
        options: selectOptionsVomPaymentHistory,
      },
      {
        name: "prepaymentPenaltyStructure",
        label: "Prepayment Structure",
        type: "select",
        options: selectOptionsPrepaymentPenaltyStructure,
      },
    ],
    []
  );

  return (
    <FilterableLoanDataCard
      title="Prepayment"
      fields={fields}
      icon={<PointOfSaleOutlined className="thin" />}
      quickFilter={quickFilter}
    />
  );
};

const DeadDealCard = ({ quickFilter }) => {
  const fields = useMemo(
    () => [
      {
        name: "dealDeadReason",
        label: "Deal Dead Reason",
        type: "text",
      },
      {
        name: "dealDeadNotes",
        label: "Deal Dead Notes",
        type: "stringMultiline",
      },
    ],
    []
  );

  return (
    <FilterableLoanDataCard
      title="Dead Deal"
      fields={fields}
      icon={<DoDisturbOutlined className="thin" />}
      quickFilter={quickFilter}
    />
  );
};

const FilterableLoanDataCard = ({ title, fields, quickFilter, icon }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  return (
    <TitledCard variant="h3" title={title} icon={icon}>
      <RffLoanDataGroup initialValues={loanDrilldown}>
        <LoanDrilldownEditableDataFieldsRenderer
          quickFilter={quickFilter}
          fields={fields}
        />
      </RffLoanDataGroup>
    </TitledCard>
  );
};

const LoanDrilldownEditableDataFieldsRenderer = ({ quickFilter, fields }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  // const [fieldsData, setFieldsData] = useState();
  const loanDrilldownOriginal = useMemo(() => loanDrilldown, []);
  const { updateLoanData } = useUnderwritingHook();
  const dispatch = useDispatch();

  const handleUpdateField = useCallback(
    ({ field, newValue, values, stopLoadingFn }) => {
      // Skip update if values are the same
      const oldValueDerived = loanDrilldownOriginal[field];
      console.log("handleUpdateField -->", {
        field,
        newValue,
        values,
        stopLoadingFn,
        oldValueDerived,
      });

      if (isEqual(newValue, oldValueDerived)) return;

      // return;
      updateLoanData({
        loanId: loanDrilldown?._id,
        data: { [field]: newValue },
        onSuccessFn: (res) => {
          dispatch(loanDrilldownSet(res));
          dispatch(loanPipelineClear());
          // Once the update is complete, call the success callback from UpdateFieldActions
          if (stopLoadingFn) stopLoadingFn();
        },
        onFailFn: (err) => {
          // dispatch(loanDrilldownClear());
          dispatch(loanDrilldownSet(loanDrilldownOriginal));
        },
      });
    },
    [loanDrilldown, loanDrilldownOriginal, updateLoanData, dispatch]
  );
  // useEffect(() => {
  //   setFieldsData(loanDrilldown);
  // }, [loanDrilldown]);
  return (
    <EditableDataFieldsRenderer
      quickFilter={quickFilter}
      fields={fields}
      onUpdateFn={handleUpdateField}
      data={loanDrilldown}
    />
  );
};

export default LoanDrilldownDetailsTab;
