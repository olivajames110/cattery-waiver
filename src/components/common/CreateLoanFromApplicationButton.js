import React, { useCallback, useMemo } from "react";
import { cachedDataItemSet } from "../../redux/actions/cachedDataActions";
import { isArray, isNil } from "lodash";
import BasicModal from "../modals/BasicModal";
import RffForm from "../finalForm/RffForm";
import RffGroup from "../finalForm/shared/RffGroup";
import RffSelectAutocompleteField from "../finalForm/inputs/RffSelectAutocompleteField";
import RffSelectUserEmailField from "../finalForm/inputs/RffSelectUserEmailField";
import {
  loanPipelineClear,
  loanPipelineSet,
} from "../../redux/actions/loanPipelineActions";
import { useBorrowerSubmissionsHook } from "../../hooks/useBorrowerSubmissionsHook";
import { usePipelineHook } from "../../hooks/usePipelineHook";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useUnderwritingHook } from "../../hooks/useUnderwritingHook";
import { useNavigate } from "react-router-dom";
import { loanDrilldownClear } from "../../redux/actions/loanDrilldownActions";

const typeEnums = {
  APPLICATION: "loanApps",
  CREDIT_AUTH: "creditAuths",
};
const CreateLoanFromApplicationButton = (params) => {
  const loanPipeline = useSelector((state) => state?.loanPipeline);
  const userEmailAddress = useSelector((state) => state.user?.emailAddress);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading,

    createLoanFromApplication,
  } = useUnderwritingHook();

  const onClick = (values) => {
    console.log("params", params);
    const appId = params?.data?._id;
    // console.log("onSubmit", { values, selected, loanNumberSelectOptions });

    // return;
    // dispatch(cachedDataItemSet("loanApps", null));
    // dispatch(loanPipelineClear());
    // navigate(`/loans`);
    // // dispatch(loanDrilldownClear());
    // // dispatch(cachedDataItemSet("loanApps", null));
    // // navigate(`/loan/1085`);
    // return;
    createLoanFromApplication({
      applicationId: appId,
      onSuccessFn: (d) => {
        dispatch(cachedDataItemSet("loanApps", null));
        dispatch(loanPipelineClear());
        navigate(`/loans`);
        // dispatch(cachedDataItemSet("loanApps", null));
        // dispatch(loanPipelineClear());
        // navigate(`/loans`);
        // navigate(`/loan/${d?.loanNumber}`);
      },
    });
  };

  if (params?.data?.dealId) {
    return null;
  }
  return (
    <Button loading={loading} onClick={onClick}>
      Create Loan
    </Button>
  );
};

const s = {
  _id: "6838cc915f745f83b1678057",
  createDateTime: "2025-05-29T21:07:29.484994",
  updateDateTime: "2025-05-29T21:07:29.484961",
  lastViewDateTime: "2025-05-29T21:07:29.484997",
  loanNumber: 1085,
  isTableFunding: false,
  isBalanceSheetClosing: false,
  loanStatus: "Prospect",
  loanProductType: "DSCR",
  loanPurpose: "Purchase",
  permittedUsers: ["joliva@cliffcomortgage.com"],
  baseLoanAmount: 0,
  totalHoldback: 0,
  dutchInterest: false,
  subjectProperties: [
    {
      _id: "6838cc915f745f83b1678058",
      address: {
        fullAddress: "70 Charles Lindbergh Boulevard, Uniondale, NY 11530",
        streetName: "Charles Lindbergh Boulevard",
        streetNumber: "70",
        zip: "11530",
        county: "NY",
        state: "New York",
        city: "Garden City",
        country: "United States",
        latitude: 40.725273,
        longitude: -73.602882,
        id: "PRonXvpg5N91VnaV1tnQoA-1748437903793",
        countryCode: "US",
        coordinateTuple: [40.725273, -73.602882],
        score: 0.9338527030561777,
        streetAddress: "70 Charles Lindbergh Boulevard",
      },
      propertyType: "2-unit",
      propertyRuralIndicator: false,
      purchasePrice: 1300000,
      purchaseDate: "2025-06-20T04:00:00+00:00",
      propertyConditionAtOrigination: "C2",
      scopeOfWork: [],
      units: [],
      costBasis: 1300000,
      unitCount: 0,
      vacantUnitCount: 0,
      residentialUnitCount: 0,
      commercialUnitCount: 0,
      monthlyTaxes: 0,
      monthlyInsurance: 0,
      monthlyFloodInsurance: 0,
      monthlyHoaFees: 0,
      monthlyPropertyMgmtFees: 0,
      monthlyOtherExpense: 0,
    },
  ],
  borrowers: [
    {
      _id: "6838cc915f745f83b1678059",
      ficoLow: 0,
      ficoMid: 0,
      ficoMax: 0,
      otherLiquidity: 0,
      cashLiquidity: 0,
      entityPercentOwnership: 0,
      isGuarantor: false,
      isPrimaryContactForLoan: false,
      foreignNationalFlag: false,
      firstTimeHomebuyer: false,
      hasExperienceWithIncomeProducingProperties: false,
      hasExperienceWithFixFlips: false,
      hasExperienceWithGroundUpConstruction: false,
      totalLiquidity: 0,
    },
  ],
  updateHistory: [],
  expectedClosingDate: "2025-06-13T04:00:00+00:00",
  interestRate: 0,
  discountPoints: 0,
  originationPoints: 0,
  floatingRateLoanRateIndex: "SOFR",
  interestCalcType: "Actual/360",
  outstandingLoanUpb: 0,
  existingLoanInDefault: false,
  applications: ["68370c6927359bd226b0d1ce"],
  underwritingCheckList: {
    initialUnderwritingIsCompletedStatus: false,
  },
  createdBy: "joliva@cliffcomortgage.com",
  createdFrom: "loanApplication",
  createdFromLoanApp: "68370c6927359bd226b0d1ce",
  totalLoanAmount: 0,
  _property_totals: {
    purchasePrice: 1300000,
    asIsValue: 0,
    arv: 0,
    secondaryAsIsValue: 0,
    secondaryArv: 0,
    costBasis: 1300000,
    assignmentFees: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    annualFloodInsurance: 0,
    annualHoaFees: 0,
    annualPropertyMgmtFees: 0,
    annualOtherExpense: 0,
    constructionBudget: 0,
  },
  totalPurchasePrice: 1300000,
  totalAsIsValue: 0,
  totalArv: 0,
  totalSecondaryAsIsValue: 0,
  totalSecondaryArv: 0,
  totalCostBasis: 1300000,
  totalAssignmentFees: 0,
  totalAnnualTaxes: 0,
  totalAnnualInsurance: 0,
  totalAnnualFloodInsurance: 0,
  totalAnnualHoaFees: 0,
  totalAnnualPropertyMgmtFees: 0,
  totalAnnualOtherExpense: 0,
  totalConstructionBudget: 0,
  baseLoanToAsIsValue: 0,
  baseLoanToCost: 0,
  baseLoanToPurchasePrice: 0,
  totalLoanToArv: 0,
};
export default CreateLoanFromApplicationButton;
