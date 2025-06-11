import { isEmpty, isNil } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import EditableDataFieldsRenderer from "../../../../components/common/EditableDataFieldsRenderer";
import JsonPreview from "../../../../components/common/JsonPreview";
import TitledEditableFieldsRenderer from "../../../../components/common/TitledEditableFieldsRenderer";
import InputWrapper from "../../../../components/inputs/shared/InputWrapper";
import Flx from "../../../../components/layout/Flx";
import TabPanel from "../../../../components/navigation/TabPanel";
import ToggleTabSwitcher from "../../../../components/navigation/ToggleTabSwitcher";
import TablePreviewCard from "../../../../components/ui/TablePreviewCard";
import TitledGroup from "../../../../components/ui/TitledGroup";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import { useNavigate, useParams } from "react-router-dom";
import LoanDrilldownAddressSection from "../../../../components/common/LoanDrilldownAddressSection";
import { PersonOutline } from "@mui/icons-material";

function BorrowerPreview({ selectedId }) {
  const { id: loanId } = useParams();
  const navigate = useNavigate();

  const [selected, setSelected] = useState(null);
  const [formSpy, setFormSpy] = useState(false);
  const [quickFilter, setQuickFilter] = useState("");
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  const onClose = useCallback(() => {
    navigate(`/loan/${loanId}/borrowers`);
  }, [loanId, navigate]);

  const borrowers = useMemo(
    () => loanDrilldown?.borrowers || [],
    [loanDrilldown]
  );
  const dispatch = useDispatch();
  const { updateBorrower } = useUnderwritingHook();

  const onUpdateBorrower = ({ values, stopLoadingFn }) => {
    // console.log("values", values, stopLoadingFn);
    // if (stopLoadingFn) stopLoadingFn();

    updateBorrower({
      borrowerId: selected?._id,
      loanId: loanDrilldown?._id,
      data: values,
      onSuccessFn: (response) => {
        console.log("response", response);
        stopLoadingFn();
        dispatch(loanDrilldownSet(response));
      },
    });
  };
  // For toggling different tabs
  const [tab, setTab] = useState("Borrower Details");

  const memoizedSetTab = useCallback((newTab) => setTab(newTab), []);

  const handleOnClose = useCallback((props) => {
    setSelected(null);
    onClose();
  }, []);

  useEffect(() => {
    if (isNil(selectedId)) {
      setSelected(null);
      return;
    }
    const borrower = borrowers?.find(
      (b) => b._id === selectedId || b.id === selectedId
    );
    setSelected(borrower);
  }, [selectedId, borrowers]);
  // Optionally you can add a quickFilter state for searching in the fields
  //   const [quickFilter, setQuickFilter] = useState("");

  const cardTitle = useMemo(() => {
    return (
      `${selected?.firstName ?? ""} ${selected?.lastName ?? ""}`.trim() ||
      "Borrower"
    );
  }, [selected]);

  // ---------------
  // 1) Borrower Details (Left Column)
  // ---------------
  const borrowerDetailsGroup = useMemo(() => {
    return [
      {
        name: "firstName",
        label: "First Name",
        type: "text",
      },
      {
        name: "lastName",
        label: "Last Name",
        type: "text",
      },
      {
        name: "emailAddress",
        label: "Email",
        type: "email",
      },
      {
        name: "phone",
        label: "Phone",
        type: "phone",
      },
      {
        name: "dateOfBirth",
        label: "Date of Birth",
        type: "date",
      },
      {
        name: "citizenshipStatus",
        label: "Borrower Citizenship",
        type: "select",
        options: [
          "US Citizen",
          "Foreign National with SSN",
          "Foreign National",
          "Foreign National Non-Resident",
          "Other - Options do not apply",
        ],
      },
      {
        name: "maritalStatus",
        label: "Marital Status",
        type: "select",
        options: ["Married", "Not Married"],
      },
      {
        name: "borrowerHasSSN",
        label: "Does borrower have a US issued SSN?",
        type: "booleanToggle",
      },
      {
        name: "borrowerSSN",
        label: "Social Security Number",
        type: "ssn",
        // If you have "condition" logic, you can do it like:
        // condition: { field: "borrowerHasSSN", value: true }
      },
    ];
  }, []);

  // ---------------
  // 3) Liquidity (Right Column)
  // ---------------
  const liquidityGroup = useMemo(() => {
    return [
      {
        name: "cashLiquidity",
        label: "Total Cash Liquidity (personal/entity accounts)",
        type: "dollar",
      },
      {
        name: "otherLiquidity",
        label: "Total Value of Other Liquidity Sources",
        type: "dollar",
      },
    ];
  }, []);

  // ---------------
  // 4) Credit Information (Right Column)
  // ---------------
  const creditInformationGroup = useMemo(() => {
    return [
      {
        name: "ficoLow",
        label: "FICO Score (Low)",
        type: "integer",
      },
      {
        name: "ficoMid",
        label: "FICO Score (Mid)",
        type: "integer",
      },
      {
        name: "ficoMax",
        label: "FICO Score (High)",
        type: "integer",
      },
      {
        name: "creditReportDate",
        label: "Credit Report Date",
        type: "date",
      },
      {
        name: "creditAuthDate",
        label: "Credit Authorization Date",
        type: "date",
      },
      {
        name: "backgroundDate",
        label: "Background Check Date",
        type: "date",
      },
    ];
  }, []);

  // ---------------
  // 5) Entity Information (Right Column)
  // ---------------
  const entityInformationGroup = useMemo(() => {
    return [
      {
        name: "entityPercentOwnership",
        label: "Entity Percent Ownership",
        type: "percent",
      },

      {
        name: "isGuarantor",
        label: "Is Guarantor?",
        type: "booleanToggle",
      },
    ];
  }, []);

  // ---------------
  // 6) ID Verification (Right Column)
  // ---------------
  const idVerificationGroup = useMemo(() => {
    return [
      {
        name: "borrowerIdType",
        label: "ID Type",
        type: "select",
        options: [
          "Driver's License",
          "Passport",
          "State ID",
          "Military ID",
          // etc.
        ],
      },
      {
        name: "foreignNationalFlag",
        label: "Is Foreign National?",
        type: "booleanToggle",
      },
    ];
  }, []);

  // ---------------
  // 7) Company Info (separate Tab)
  // ---------------
  const companyInformationGroup = useMemo(() => {
    return [
      {
        name: "company",
        label: "Company Name",
      },
      {
        name: "role",
        label: "Role",
      },
      {
        name: "directBorrower",
        label: "Is Direct Borrower?",
        type: "booleanToggle",
      },
      {
        name: "broker",
        label: "Is Broker?",
        type: "booleanToggle",
      },
    ];
  }, []);

  // ---------------
  // 8) Background (separate Tab)
  // ---------------
  const backgroundGroup = useMemo(() => {
    return [
      {
        name: "estimatedFICO",
        label: "Borrower Estimated FICO Range",
        type: "select",
        options: [
          "Below 600",
          "600-620",
          "620-650",
          "650-680",
          "680-700",
          "700-720",
          "Greater than 720",
          "N/A do not have FICO",
        ],
      },
      {
        name: "application_felony_conviction",
        label: "Ever convicted of a felony?",
        type: "booleanToggle",
      },
      {
        name: "application_financial_fraud_misdemeanor",
        label: "Ever convicted of financial/fraud-related crimes?",
        type: "booleanToggle",
      },
      {
        name: "bankruptcy_flag",
        label: "Filed for bankruptcy in the last 5 years?",
        type: "booleanToggle",
      },
      {
        name: "firstTimeHomebuyer",
        label: "Ever owned a primary residence?",
        type: "booleanToggle",
      },
      // Open liens/judgments
      {
        name: "open_liens_judgments",
        label: "Any charge-offs, tax liens, pending litigation, or judgments?",
        type: "booleanToggle",
      },
      {
        name: "charge_offs",
        label: "Charge Offs",
        type: "booleanCheckbox",
        // condition: { field: "open_liens_judgments", value: true },
      },
      {
        name: "tax_liens",
        label: "Tax Liens",
        type: "booleanCheckbox",
        // condition: { field: "open_liens_judgments", value: true },
      },
      {
        name: "financial_judgements",
        label: "Financial Judgements",
        type: "booleanCheckbox",
        // condition: { field: "open_liens_judgments", value: true },
      },
      {
        name: "pending_litigation",
        label: "Pending Litigation",
        type: "booleanCheckbox",
        // condition: { field: "open_liens_judgments", value: true },
      },
      // Housing events
      {
        name: "housing_events",
        label:
          "Past 3 yrs: any forbearances, mods, foreclosures, or mortgage lates?",
        // type: "booleanToggle",
      },
      {
        name: "time_since_housing_event",
        label: "Time Since Last Housing Event",
        type: "select",
        options: [
          "Within the last 12-months",
          "Within the last 2-years",
          "Greater than 2-years ago",
        ],
        // condition: { field: "housing_events", value: true },
      },
      {
        name: "forbearance_or_modification",
        label: "Forbearance or Modification",
        type: "booleanCheckbox",
        // condition: { field: "housing_events", value: true },
      },
      {
        name: "mortgage_lates",
        label: "Mortgage Lates",
        type: "booleanCheckbox",
        // condition: { field: "housing_events", value: true },
      },
      {
        name: "foreclosure",
        label: "Lis Pendens or Foreclosure",
        type: "booleanCheckbox",
        // condition: { field: "housing_events", value: true },
      },
    ];
  }, []);

  // ---------------
  // 9) Experience (separate Tab)
  // ---------------
  const experienceGroup = useMemo(() => {
    return [
      {
        name: "isExperienced",
        label: "Is Experienced?",
        type: "booleanToggle",
      },
      {
        name: "hasExperienceWithIncomeProducingProperties",
        label: "Experience with Income-Producing Properties?",
        type: "booleanToggle",
      },
      {
        name: "hasExperienceWithFixFlips",
        label: "Experience with Fix & Flips?",
        type: "booleanToggle",
      },
      {
        name: "hasExperienceWithGroundUpConstruction",
        label: "Experience with Ground-Up Construction?",
        type: "booleanToggle",
      },
      {
        name: "borrowerExperienceSummary",
        label: "Summary of Borrower Investor Experience",
        type: "stringMultiline",
      },
    ];
  }, []);

  // ---------------
  // 11) Additional Notes (separate Tab)
  // ---------------
  const additionalNotesGroup = useMemo(() => {
    return [
      {
        name: "additional_borrower_notes",
        label: "Additional Borrower Notes",
        type: "stringMultiline",
      },
    ];
  }, []);

  // -----------------
  // RENDER
  // -----------------

  if (isNil(selected) || isEmpty(selected)) return null;

  return (
    <TablePreviewCard
      title={cardTitle}
      onClose={handleOnClose}
      formSpy={formSpy}
      quickFilter={quickFilter}
      setQuickFilter={setQuickFilter}
      setFormSpy={setFormSpy}
      bodySx={{ p: 0 }}
      icon={<PersonOutline className="thin" />}
      searchPlaceholder="Search borrower fields..."
    >
      <Flx column gap={1.5}>
        <ToggleTabSwitcher
          value={tab}
          variant={"underline"}
          onChange={memoizedSetTab}
          tabs={[
            "Borrower Details",
            "Primary Address",
            "Company Info",
            "Background",
            "Experience",
            "Additional Notes",
            "All",
          ]}
        />

        <Flx fw column gap={3}>
          <TabPanel
            value="Borrower Details"
            tabValue={tab}
            forceDisplay="All"
            sx={{ flexGrow: 1 }}
          >
            <Flx fw column gap={3}>
              <TitledEditableFieldsRenderer
                uppercase
                fontWeight={600}
                title="Borrower Details"
                quickFilter={quickFilter}
                data={selected}
                onUpdateFn={onUpdateBorrower}
                fields={borrowerDetailsGroup}
              />

              <TitledEditableFieldsRenderer
                uppercase
                fontWeight={600}
                title="Liquidity"
                data={selected}
                quickFilter={quickFilter}
                onUpdateFn={onUpdateBorrower}
                fields={liquidityGroup}
              />
              <TitledEditableFieldsRenderer
                uppercase
                fontWeight={600}
                title="Credit Information"
                data={selected}
                quickFilter={quickFilter}
                onUpdateFn={onUpdateBorrower}
                fields={creditInformationGroup}
              />
              <TitledEditableFieldsRenderer
                uppercase
                fontWeight={600}
                title="Entity Information"
                data={selected}
                quickFilter={quickFilter}
                onUpdateFn={onUpdateBorrower}
                fields={entityInformationGroup}
              />
              <TitledEditableFieldsRenderer
                uppercase
                fontWeight={600}
                title="ID Verification"
                data={selected}
                quickFilter={quickFilter}
                onUpdateFn={onUpdateBorrower}
                fields={idVerificationGroup}
              />
            </Flx>
          </TabPanel>

          {/* Company Info Tab */}
          <TabPanel value="Primary Address" tabValue={tab} forceDisplay="All">
            <TitledGroup title={"Primary Address"} fontWeight={600}>
              <LoanDrilldownAddressSection
                quickFilter={quickFilter}
                uppercase
                borrower={selected}
                name="primaryAddress"
              />
            </TitledGroup>
          </TabPanel>
          <TabPanel value="Company Info" tabValue={tab} forceDisplay="All">
            <TitledEditableFieldsRenderer
              uppercase
              fontWeight={600}
              title="Company Info"
              data={selected}
              quickFilter={quickFilter}
              onUpdateFn={onUpdateBorrower}
              fields={companyInformationGroup}
            />
          </TabPanel>

          {/* Background Tab */}
          <TabPanel value="Background" tabValue={tab} forceDisplay="All">
            <TitledEditableFieldsRenderer
              uppercase
              fontWeight={600}
              title="Borrower Background"
              data={selected}
              quickFilter={quickFilter}
              onUpdateFn={onUpdateBorrower}
              fields={backgroundGroup}
            />
          </TabPanel>

          {/* Experience Tab */}
          <TabPanel value="Experience" tabValue={tab} forceDisplay="All">
            <>
              <TitledEditableFieldsRenderer
                uppercase
                fontWeight={600}
                title="Experience Summary"
                data={selected}
                quickFilter={quickFilter}
                onUpdateFn={onUpdateBorrower}
                fields={experienceGroup}
              />

              <TitledGroup title="Detailed Experience">
                <BorrowerExperienceFields
                  uppercase
                  selected={selected}
                  onUpdateFn={onUpdateBorrower}
                  quickFilter={quickFilter}
                />
              </TitledGroup>
            </>
          </TabPanel>

          {/* Additional Notes */}
          <TabPanel value="Additional Notes" tabValue={tab} forceDisplay="All">
            <TitledEditableFieldsRenderer
              uppercase
              fontWeight={600}
              title="Additional Notes"
              data={selected}
              quickFilter={quickFilter}
              onUpdateFn={onUpdateBorrower}
              fields={additionalNotesGroup}
            />
          </TabPanel>
          <JsonPreview show={formSpy} values={selected} />
        </Flx>
      </Flx>
    </TablePreviewCard>
  );
}

const BorrowerExperienceFields = ({ selected, quickFilter, onUpdateFn }) => {
  return (
    <Flx
      gap={6}
      wrap
      sx={{
        mt: 2,
        ".input-wrapper-root": {
          // py: 2,
          flexGrow: 1,
          flexBasis: "400px",
        },
      }}
    >
      <ExperienceGroup
        label="Property fix and flips completed and sold"
        name="ff_sold"
        quickFilter={quickFilter}
        data={selected}
        onUpdateFn={onUpdateFn}
      />
      <ExperienceGroup
        label="Income Producing Properties acquired"
        name="income_producing_properties"
        quickFilter={quickFilter}
        data={selected}
        onUpdateFn={onUpdateFn}
      />
      <ExperienceGroup
        label="Property rehabs completed and retained as rental"
        name="ff_retained_as_rental"
        quickFilter={quickFilter}
        data={selected}
        onUpdateFn={onUpdateFn}
      />
      <ExperienceGroup
        label="Property rehab completed and sold as GC for 3rd party investor"
        name="general_contractor_projects"
        quickFilter={quickFilter}
        data={selected}
        onUpdateFn={onUpdateFn}
      />
      <ExperienceGroup
        label="Ground up construction - completed and sold"
        name="guc_sold"
        quickFilter={quickFilter}
        data={selected}
        onUpdateFn={onUpdateFn}
      />
      <ExperienceGroup
        label="Ground up construction and retained as rental"
        name="guc_retained_as_rental"
        quickFilter={quickFilter}
        data={selected}
        onUpdateFn={onUpdateFn}
      />
    </Flx>
  );
};

const ExperienceGroup = ({ name, onUpdateFn, quickFilter, label, data }) => {
  const [modified, setModified] = useState(false);

  const fields = useMemo(() => {
    return [
      {
        name: "last_two_years",
        label: "Last Two Years",
        type: "number",
        disabled: modified,
      },
      {
        name: "two_to_four_years",
        label: "Two to Four Years",
        type: "number",
        disabled: modified,
      },
      {
        name: "greater_than_four_years",
        label: "Greater Than Four Years",
        type: "number",
        disabled: modified,
      },
    ];
  }, [modified]);

  const handleOnUpdate = useCallback(
    (params) => {
      // console.log("handleOnUpdate", name, params);
      const { field, newValue, stopLoadingFn } = params;

      let original = { ...data?.[name] };
      // console.log("original", original);
      original[field] = newValue;
      // console.log("updated", original);

      const payload = {
        [name]: { ...original },
      };

      console.log("payload", payload);
      setModified(true);
      onUpdateFn({
        values: payload,
        stopLoadingFn: (fn) => {
          setModified(false);
          stopLoadingFn();
        },
      });
    },
    [data]
  );

  return (
    <InputWrapper
      label={label}
      labelSx={{ fontSize: 13, fontWeight: 500, fontStyle: "italic" }}
    >
      <EditableDataFieldsRenderer
        quickFilter={quickFilter}
        fields={fields}
        data={data?.[name]}
        onUpdateFn={handleOnUpdate}
      />
    </InputWrapper>
  );
};

export default React.memo(BorrowerPreview);
