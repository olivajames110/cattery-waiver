// PropertyDrilldown.jsx
import { EditOutlined, StoreOutlined } from "@mui/icons-material";
import { Button, Card, Divider, Grid2 } from "@mui/material";
import { isEmpty, isNil } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import AddressMap from "../../../../components/common/AddressMap";
import TitledEditableFieldsRenderer from "../../../../components/common/TitledEditableFieldsRenderer";
import RffLoanDataGroup from "../../../../components/finalForm/shared/RffLoanDataGroup";
import AddressGeolocateInput from "../../../../components/inputs/AddressGeolocateInput";
import Flx from "../../../../components/layout/Flx";
import Txt from "../../../../components/typography/Txt";
import TablePreviewCard from "../../../../components/ui/TablePreviewCard";
import { selectOptionsPropertyConditionAtOrigination } from "../../../../constants/selectOptions/selectOptionsPropertyConditionAtOrigination";
import { selectOptionsPropertyStatusAtOrigination } from "../../../../constants/selectOptions/selectOptionsPropertyStatusAtOrigination";
import { selectOptionsPropertyType } from "../../../../constants/selectOptions/selectOptionsPropertyType";
import { useAddressHook } from "../../../../hooks/useAddressHook";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import LoanDrilldownAddressSection from "../../../../components/common/LoanDrilldownAddressSection";
import ToggleTabSwitcher from "../../../../components/navigation/ToggleTabSwitcher";
import TabPanel from "../../../../components/navigation/TabPanel";

function PropertyDrilldown({ selectedId }) {
  const { id: loanId } = useParams();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [formSpy, setFormSpy] = useState(false);
  const [quickFilter, setQuickFilter] = useState("");
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const [tab, setTab] = useState("Property Details");

  const onClose = useCallback(() => {
    navigate(`/loan/${loanId}/properties`);
  }, [loanId, navigate]);
  const memoizedSetTab = useCallback((newTab) => setTab(newTab), []);
  const subjectProperties = useMemo(
    () => loanDrilldown?.subjectProperties || [],
    [loanDrilldown]
  );

  const dispatch = useDispatch();
  const { updateSubjectProperty } = useUnderwritingHook();

  const onPropertyUpdate = ({ values, stopLoadingFn }) => {
    // console.log("values", values, stopLoadingFn);
    // return;
    updateSubjectProperty({
      propertyId: selected?._id,
      loanId: loanDrilldown?._id,
      data: values,
      onSuccessFn: (response) => {
        // console.log("response", response);
        dispatch(loanDrilldownSet(response));
        stopLoadingFn();
      },
      onCompleteFn: () => {
        stopLoadingFn();
      },
    });
  };

  useEffect(() => {
    // if (isNil(selectedId)) return;
    if (isNil(selectedId)) {
      setSelected(null);
      return;
    }
    const property = subjectProperties?.find(
      (b) => b._id === selectedId || b.id === selectedId
    );
    setSelected(property);
  }, [selectedId, subjectProperties]);
  // Title for the preview card
  const cardTitle = selected?.address?.fullAddress || "Property Details";

  /**
   * 2. Property Details
   */
  const propertyDetailsGroup = useMemo(() => {
    return [
      {
        name: "propertyType",
        label: "Property Type",
        type: "select",
        options: selectOptionsPropertyType,
      },
      {
        name: "proposedPropertyType",
        label: "Proposed Property Type",
        type: "select",
        options: selectOptionsPropertyType,
      },
      {
        name: "propertyRuralIndicator",
        label: "Property Rural Indicator",
        type: "booleanToggle",
      },
      {
        name: "floodZone",
        label: "Flood Zone",
        type: "booleanToggle",
      },
      {
        name: "floodCertDate",
        label: "Flood Cert Date",
        type: "date",
      },
      {
        name: "propertyListedForSale",
        label: "Property Listed For Sale",
        type: "booleanToggle",
      },
      {
        name: "lastListedForSaleDate",
        label: "Last Listed For Sale Date",
        type: "date",
      },
      {
        name: "lastListedForSalePrice",
        label: "Last Listed For Sale Price",
        type: "dollar",
      },
    ];
  }, []);

  /**
   * 3. Valuation Info
   */
  const valuationInfoGroup = useMemo(() => {
    return [
      {
        name: "asIsValue",
        label: "As-Is Value",
        type: "dollar",
      },
      {
        name: "secondaryAsIsValue",
        label: "Secondary As-Is Value",
        type: "dollar",
      },
      {
        name: "secondaryAsIsVariance",
        label: "Secondary As-Is Variance",
        type: "percentage",
      },
      {
        name: "arv",
        label: "After Repair Value (ARV)",
        type: "dollar",
      },
      {
        name: "secondaryArv",
        label: "Secondary ARV",
        type: "dollar",
      },
      {
        name: "appraisalDate",
        label: "Appraisal Date",
        type: "date",
      },
      {
        name: "secondaryAppraisalDate",
        label: "Secondary Appraisal Date",
        type: "date",
      },
    ];
  }, []);

  /**
   * 4. Purchase Info
   */
  const purchaseInfoGroup = useMemo(() => {
    return [
      {
        name: "purchasePrice",
        label: "Purchase Price",
        type: "dollar",
      },
      {
        name: "purchaseDate",
        label: "Purchase Date",
        type: "date",
      },
      {
        name: "costBasis",
        label: "Cost Basis",
        type: "dollar",
      },
      {
        name: "additionalBasis",
        label: "Additional Basis",
        type: "dollar",
      },
      {
        name: "assignmentFees",
        label: "Assignment Fees",
        type: "dollar",
      },
      {
        name: "sellersConcession",
        label: "Seller's Concession",
        type: "dollar",
      },
    ];
  }, []);

  /**
   * 5. Construction / Rehab
   */
  const constructionInfoGroup = useMemo(() => {
    return [
      {
        name: "constructionBudget",
        label: "Construction Budget",
        type: "dollar",
      },
      {
        name: "financedBudget",
        label: "Financed Budget",
        type: "dollar",
      },
      {
        name: "financedBudgetPercent",
        label: "Financed Budget Percent",
        type: "percentage",
      },
      {
        name: "budgetIsFinal",
        label: "Budget Is Final",
        type: "booleanToggle",
      },
      {
        name: "budgetMatchesAppraisal",
        label: "Budget Matches Appraisal",
        type: "booleanToggle",
      },
      {
        name: "finalBudgetUploaded",
        label: "Final Budget Uploaded",
        type: "booleanToggle",
      },
      {
        name: "finalBudgetFeasible",
        label: "Final Budget Feasible",
        type: "booleanToggle",
      },
      // {
      //   name: "scopeOfWork",
      //   label: "Scope Of Work",
      //   type: "number",
      // },
    ];
  }, []);

  /**
   * 6. Property Condition
   */
  const propertyConditionGroup = useMemo(() => {
    return [
      {
        name: "propertyConditionAtOrigination",
        label: "Condition at Origination",
        type: "select",
        options: selectOptionsPropertyConditionAtOrigination,
      },
      {
        name: "propertyStatusAtOrigination",
        label: "Status at Origination",
        type: "selectMultiple",
        // type: "select",
        options: selectOptionsPropertyStatusAtOrigination,
      },
    ];
  }, []);

  /**
   * 7. Property Notes
   */

  /**
   * 8. Units / Square Footage
   */
  const unitsGroup = useMemo(() => {
    return [
      {
        name: "unitCount",
        label: "Unit Count",
      },
      {
        name: "vacantUnitCount",
        label: "Vacant Unit Count",
      },
      {
        name: "residentialUnitCount",
        label: "Residential Unit Count",
      },
      {
        name: "commercialUnitCount",
        label: "Commercial Unit Count",
      },
      {
        name: "residentialSqFootage",
        label: "Residential Sq. Footage",
        type: "float",
      },
      {
        name: "commercialSqFootage",
        label: "Commercial Sq. Footage",
        type: "float",
      },
      {
        name: "afterRenoSqFootage",
        label: "After Reno Sq. Footage",
        type: "float",
      },
      {
        name: "units",
        label: "Units Table (if applicable)",
        type: "stringMultiline",
      },
    ];
  }, []);

  /**
   * 9. Expenses (Annual & Monthly)
   */
  const expensesGroup = useMemo(() => {
    return [
      // Annual
      {
        name: "annualTaxes",
        label: "Annual Taxes",
        type: "dollar",
      },
      {
        name: "annualInsurance",
        label: "Annual Insurance",
        type: "dollar",
      },
      {
        name: "annualFloodInsurance",
        label: "Annual Flood Insurance",
        type: "dollar",
      },
      {
        name: "annualHoaFees",
        label: "Annual HOA Fees",
        type: "dollar",
      },
      {
        name: "annualPropertyMgmtFees",
        label: "Annual Property Mgmt Fees",
        type: "dollar",
      },
      {
        name: "annualOtherExpense",
        label: "Annual Other Expense",
        type: "dollar",
      },
      // Monthly
      {
        name: "monthlyTaxes",
        label: "Monthly Taxes",
        type: "dollar",
      },
      {
        name: "monthlyInsurance",
        label: "Monthly Insurance",
        type: "dollar",
      },
      {
        name: "monthlyFloodInsurance",
        label: "Monthly Flood Insurance",
        type: "dollar",
      },
      {
        name: "monthlyHoaFees",
        label: "Monthly HOA Fees",
        type: "dollar",
      },
      {
        name: "monthlyPropertyMgmtFees",
        label: "Monthly Property Mgmt Fees",
        type: "dollar",
      },
      {
        name: "monthlyOtherExpense",
        label: "Monthly Other Expense",
        type: "dollar",
      },
    ];
  }, []);

  // If no property selected, don't render anything
  if (isNil(selected) || isEmpty(selected)) {
    return null;
  }
  return (
    <TablePreviewCard
      title={cardTitle}
      onClose={onClose}
      formSpy={formSpy}
      quickFilter={quickFilter}
      setQuickFilter={setQuickFilter}
      setFormSpy={setFormSpy}
      searchPlaceholder="Search in property..."
      icon={<StoreOutlined className="thin" />}
    >
      <Flx column gap={1.5}>
        <LoanDrilldownAddressSection
          quickFilter={quickFilter}
          property={selected}
        />

        <ToggleTabSwitcher
          value={tab}
          variant={"underline"}
          onChange={memoizedSetTab}
          tabs={[
            "Property Details",
            "Valuation Info",
            "Purchase Info",
            "Construction/Rehab",
            "Units/Square Footage",
            "Property Condition",
            "Expenses",
            "All",
          ]}
        />
        <Flx column gap={3}>
          <PropertyTab tab="Property Details" tabValue={tab}>
            <TitledEditableFieldsRenderer
              uppercase
              title="Property Details"
              quickFilter={quickFilter}
              onUpdateFn={onPropertyUpdate}
              data={selected}
              fields={propertyDetailsGroup}
            />
          </PropertyTab>

          <PropertyTab tab="Valuation Info" tabValue={tab}>
            <TitledEditableFieldsRenderer
              uppercase
              title="Valuation Info"
              quickFilter={quickFilter}
              onUpdateFn={onPropertyUpdate}
              data={selected}
              fields={valuationInfoGroup}
            />
          </PropertyTab>
          <PropertyTab tab="Purchase Info" tabValue={tab}>
            <TitledEditableFieldsRenderer
              uppercase
              title="Purchase Info"
              quickFilter={quickFilter}
              onUpdateFn={onPropertyUpdate}
              data={selected}
              fields={purchaseInfoGroup}
            />
          </PropertyTab>
          <PropertyTab tab="Construction/Rehab" tabValue={tab}>
            <TitledEditableFieldsRenderer
              uppercase
              title="Construction/Rehab"
              quickFilter={quickFilter}
              onUpdateFn={onPropertyUpdate}
              data={selected}
              fields={constructionInfoGroup}
            />
          </PropertyTab>
          <PropertyTab tab="Units/Square Footage" tabValue={tab}>
            <TitledEditableFieldsRenderer
              uppercase
              title="Units/Square Footage"
              quickFilter={quickFilter}
              onUpdateFn={onPropertyUpdate}
              data={selected}
              fields={unitsGroup}
            />
          </PropertyTab>
          <PropertyTab tab="Property Condition" tabValue={tab}>
            <TitledEditableFieldsRenderer
              uppercase
              title="Property Condition"
              size={12}
              quickFilter={quickFilter}
              onUpdateFn={onPropertyUpdate}
              data={selected}
              fields={propertyConditionGroup}
            />
          </PropertyTab>
          <PropertyTab tab="Expenses" tabValue={tab}>
            <TitledEditableFieldsRenderer
              uppercase
              title="Expenses"
              size={12}
              quickFilter={quickFilter}
              onUpdateFn={onPropertyUpdate}
              data={selected}
              fields={expensesGroup}
            />
          </PropertyTab>
        </Flx>
      </Flx>
    </TablePreviewCard>
  );
}

const PropertyTab = ({ tab, tabValue, children }) => {
  return (
    <TabPanel value={tab} tabValue={tabValue} forceDisplay="All">
      {children}
    </TabPanel>
  );
};

const OldPropertyAddressSection = ({
  quickFilter,
  selected,
  onPropertyUpdate,
}) => {
  const propertyNotesGroup = useMemo(() => {
    return [
      {
        name: "subjectPropertyNotes",
        label: "Subject Property Notes",
        type: "stringMultiline",
      },
    ];
  }, []);

  return (
    <>
      <Grid2 size={6}>
        <Grid2 container spacing={6}>
          <Grid2 size={12}>
            <PropertyAddressFields
              quickFilter={quickFilter}
              selected={selected}
            />
          </Grid2>
          <Grid2 size={12}>
            <TitledEditableFieldsRenderer
              title="Notes"
              size={12}
              quickFilter={quickFilter}
              onUpdateFn={onPropertyUpdate}
              data={selected}
              fields={propertyNotesGroup}
            />
          </Grid2>
        </Grid2>
      </Grid2>
      <Grid2 size={6}>
        <AddressMap address={selected?.address} height="410px" />
      </Grid2>
    </>
  );
};

const PropertyAddressFields = ({ quickFilter, selected }) => {
  const { updateSubjectProperty } = useUnderwritingHook();
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const dispatch = useDispatch();

  const address = useMemo(() => selected?.address, [selected]);
  const onPropertyUpdate = ({ values, stopLoadingFn }) => {
    const payload = {
      address: {
        ...address,
        ...values,
      },
    };
    // console.log("payload", payload);
    // return;
    updateSubjectProperty({
      propertyId: selected?._id,
      loanId: loanDrilldown?._id,
      data: payload,
      onSuccessFn: (response) => {
        // console.log("response", response);
        dispatch(loanDrilldownSet(response));
        stopLoadingFn();
      },
      onCompleteFn: () => {
        stopLoadingFn();
      },
    });
  };

  const addressGroup = useMemo(() => {
    return [
      {
        name: "fullAddress",
        label: "Full Address",
      },
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

  return (
    <TitledEditableFieldsRenderer
      title="Address"
      quickFilter={quickFilter}
      onUpdateFn={onPropertyUpdate}
      data={selected?.address}
      fields={addressGroup}
    />
  );
};

const tl = {
  _id: "67f0509cfafcaf6659325b9e",
  createDateTime: "2025-04-04T21:35:24.159000",
  updateDateTime: "2025-05-13T16:20:25.976000",
  lastViewDateTime: "2025-05-29T02:52:40.988000",
  loanNumber: 1003,
  isTableFunding: false,
  isBalanceSheetClosing: false,
  loanStatus: "Terms Accepted",
  milestoneStatusChanges: [
    {
      priorMilestoneStatus: "Prospect",
      milestoneChangeDate: "2025-04-07T20:09:02.522000",
      updatedMilestoneStatus: "Terms Accepted",
      updateBy: "joliva@cliffcomortgage.com",
      form_types: {
        priorMilestoneStatus: "string",
        milestoneChangeDate: "dateTime",
        updatedMilestoneStatus: "string",
        updateBy: "email",
      },
    },
  ],
  loanProductType: "DSCR",
  loanPurpose: "Purchase",
  salesperson: "cnguyen@cliffcomortgage.com",
  loanCloser: "rriddle@cliffcomortgage.com",
  permittedUsers: ["joliva@cliffcomortgage.com"],
  baseLoanAmount: 900000,
  totalHoldback: 400000,
  dutchInterest: false,
  loanDocuments: [],
  subjectProperties: [
    {
      _id: "67f0509cfafcaf6659325b9f",
      address: {
        fullAddress: "40 Wilbur Place, Bohemia, NY 11716",
        streetName: "Wilbur Place",
        streetNumber: "40",
        zip: "11716",
        county: "Nassau",
        state: "New York",
        city: "Bohemia",
        country: "United States",
        latitude: 40.7776806,
        longitude: -73.102155,
        countryCode: "US",
        query: "Bohemia",
        coordinateTuple: [40.7776806, -73.102155],
        score: 1,
        streetAddress: "40 Wilbur Place",
      },
      propertyType: "SFR",
      propertyRuralIndicator: false,
      asIsValue: 50000,
      commercialSqFootage: 50000,
      scopeOfWork: [],
      units: [],
      costBasis: 0,
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
      fullAddress: "40 Wilbur Place, Bohemia, NY 11716",
      streetName: "Wilbur Place",
      streetNumber: "40",
      zip: "11716",
      county: "Suffolk",
      state: "New York",
      city: "Bohemia",
      country: "United States",
      latitude: 40.7776806,
      longitude: -73.102155,
      countryCode: "US",
      query: "Bohemia",
      coordinateTuple: [40.7776806, -73.102155],
      score: 1,
      streetAddress: "40 Wilbur Place",
    },
  ],
  borrowers: [
    {
      _id: "67f0509cfafcaf6659325ba0",
      firstName: "Timm",
      lastName: "Carr",
      phone: "(555) 555-5555",
      emailAddress: "tim@email.com",
      estimatedFICO: "700-720",
      ficoLow: 0,
      ficoMid: 0,
      ficoMax: 0,
      otherLiquidity: 100000,
      cashLiquidity: 250000,
      borrowerSSN: "555555555",
      primaryAddress: {
        fullAddress: "32 Main Street North, Farmingdale, NJ 07727",
        streetName: "Main Street North",
        streetNumber: "32",
        zip: "07727",
        county: "NJ",
        state: "New Jersey",
        city: "Farmingdale",
        country: "United States",
        latitude: 40.201955,
        longitude: -74.170996,
        countryCode: "US",
        query: "Farmingdale",
        coordinateTuple: [40.201955, -74.170996],
        score: 1,
        streetAddress: "32 Main Street North",
      },
      entityPercentOwnership: 0,
      isGuarantor: false,
      isPrimaryContactForLoan: false,
      foreignNationalFlag: false,
      maritalStatus: "Married",
      firstTimeHomebuyer: false,
      housing_event_types: [],
      housing_events: false,
      hasExperienceWithIncomeProducingProperties: true,
      hasExperienceWithFixFlips: true,
      hasExperienceWithGroundUpConstruction: false,
      ff_sold: {
        last_two_years: 1,
        two_to_four_years: 0,
        greater_than_four_years: 0,
      },
      ff_retained_as_rental: {
        two_to_four_years: 1,
        last_two_years: 0,
        greater_than_four_years: 0,
      },
      income_producing_properties: {
        last_two_years: 1,
        two_to_four_years: 0,
        greater_than_four_years: 0,
      },
      guc_sold: {
        last_two_years: 0,
        two_to_four_years: 0,
        greater_than_four_years: 0,
      },
      guc_retained_as_rental: {
        last_two_years: 0,
        two_to_four_years: 0,
        greater_than_four_years: 0,
      },
      general_contractor_projects: {
        last_two_years: 0,
        two_to_four_years: 0,
        greater_than_four_years: 0,
      },
      citizenshipStatus: "US Citizen",
      dateOfBirth: "1973-04-19T05:00:00",
      borrowerHasSSN: true,
      application_felony_conviction: false,
      application_financial_fraud_misdemeanor: false,
      bankruptcy_flag: false,
      open_liens_judgments: false,
      email_lower: "tim@email.com",
      totalLiquidity: 350000,
    },
  ],
  updateHistory: [],
  expectedClosingDate: "2025-04-24T04:00:00",
  interestRate: 0,
  discountPoints: 0,
  originationPoints: 0,
  floatingRateLoanRateIndex: "SOFR",
  interestCalcType: "Actual/360",
  outstandingLoanUpb: 0,
  existingLoanInDefault: false,
  applications: [
    "67cb25e1c15fa55ee7ed7255",
    "67cb29f72fdd9fd6b7d446e4",
    "67cb2e7ab81710cf8ee5e816",
    "67cb2be1b81710cf8ee5e80f",
    "67d069df5b2b58fbdf844403",
  ],
  underwritingCheckList: {
    initialUnderwritingIsCompletedStatus: false,
  },
  createdFrom: "underwriting_ui",
  createdBy: "joliva@cliffcomortgage.com",
  totalLoanAmount: 1300000,
  totalPurchasePrice: 0,
  totalAsIsValue: 50000,
  totalArv: 0,
  totalSecondaryAsIsValue: 0,
  totalSecondaryArv: 0,
  totalCostBasis: 0,
  totalAssignmentFees: 0,
  totalAnnualTaxes: 0,
  totalAnnualInsurance: 0,
  totalAnnualFloodInsurance: 0,
  totalAnnualHoaFees: 0,
  totalAnnualPropertyMgmtFees: 0,
  totalAnnualOtherExpense: 0,
  totalConstructionBudget: 0,
  baseLoanToAsIsValue: 18,
  baseLoanToCost: 0,
  baseLoanToPurchasePrice: 0,
  totalLoanToArv: 0,
  lastViewBy: "joliva@cliffcomortgage.com",
  updateDatetime: "2025-05-05T21:43:18.468000",
  updateBy: "cnguyen@cliffcomortgage.com",
  loanUnderwriter: "joliva@cliffcomortgage.com",
  loanProcessor: "dev1@cliffcomortgage.com",
  _property_totals: {
    purchasePrice: 0,
    asIsValue: 50000,
    arv: 0,
    secondaryAsIsValue: 0,
    secondaryArv: 0,
    costBasis: 0,
    assignmentFees: 0,
    annualTaxes: 0,
    annualInsurance: 0,
    annualFloodInsurance: 0,
    annualHoaFees: 0,
    annualPropertyMgmtFees: 0,
    annualOtherExpense: 0,
    constructionBudget: 0,
  },
};
export default React.memo(PropertyDrilldown);
