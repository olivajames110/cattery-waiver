import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import RffLoanBorrowerExperienceTable from "../../../../components/finalForm/features/RffLoanBorrowerExperienceTable";
import RffAddressGeolocateField from "../../../../components/finalForm/inputs/RffAddressGeolocateField";
import RffBooleanCheckbox from "../../../../components/finalForm/inputs/RffBooleanCheckbox";
import RffBooleanToggleField from "../../../../components/finalForm/inputs/RffBooleanToggleField";
import RffDateField from "../../../../components/finalForm/inputs/RffDateField";
import RffDollarField from "../../../../components/finalForm/inputs/RffDollarField";
import RffEmailField from "../../../../components/finalForm/inputs/RffEmailField";
import RffPhoneField from "../../../../components/finalForm/inputs/RffPhoneField";
import RffSelectToggleField from "../../../../components/finalForm/inputs/RffSelectToggleField";
import RffSsnField from "../../../../components/finalForm/inputs/RffSsnField";
import RffTextareaField from "../../../../components/finalForm/inputs/RffTextareaField";
import RffTextField from "../../../../components/finalForm/inputs/RffTextField";
import RffForm from "../../../../components/finalForm/RffForm";
import RffConditional from "../../../../components/finalForm/shared/RffConditional";
import RffGroup from "../../../../components/finalForm/shared/RffGroup";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import { sidebarClear } from "../../../../redux/actions/sidebarActions";
import { rffDependentGroupStyles } from "../../../../styles/rffDependentGroupStyles";
import DrilldownSidebarPane from "../DrilldownSidebarPane";
import RffSelectMultipleField from "../../../../components/finalForm/inputs/RffSelectMultipleField";
import { selectOptionsHousingEvents } from "../../../../constants/selectOptions/selectOptionsHousingEvents";
import { isEmpty } from "lodash";

const DrilldownSidebarAddBorrower = memo(() => {
  const loan = useSelector((state) => state.loanDrilldown);
  const { createBorrower, loading } = useUnderwritingHook();
  const dispatch = useDispatch();
  const onSubmit = (values) => {
    createBorrower({
      loanId: loan?._id,
      borrower: values,
      onSuccessFn: (response) => {
        dispatch(loanDrilldownSet(response));
        dispatch(sidebarClear());
      },
    });
  };

  return (
    <DrilldownSidebarPane
      title="Add Borrower"
      maxWidth="40vw"
      initialWidth={"700px"}
      variant="fixed"
    >
      <RffForm onSubmit={onSubmit} loading={loading}>
        {/* START BORROWER */}
        <RffGroup>
          <RffTextField name={`firstName`} label="First Name" size={6} />
          <RffTextField name={`lastName`} label="Last Name" size={6} />
          <RffEmailField size={4} name={`emailAddress`} label="Email" />
          <RffPhoneField size={4} name={`phone`} label="Phone" />

          <RffDateField size={4} name={`dateOfBirth`} label="Date of birth" />

          <RffSelectToggleField
            name={`citizenshipStatus`}
            label="Borrower Citizenship"
            options={[
              "US Citizen",
              "Foreign National with SSN",
              "Foreign National",
              "Foreign National Non-Resident",
              "Other - Options do not apply",
            ]}
          />

          <RffConditional
            operatorForMultiple={"OR"}
            rules={[
              {
                field: `citizenshipStatus`,
                operator: "==",
                value: "US Citizen",
              },
              {
                field: `citizenshipStatus`,
                operator: "==",
                value: "Foreign National with SSN",
              },
              {
                field: `citizenshipStatus`,
                operator: "==",
                value: "Foreign National",
              },
            ]}
          >
            <RffAddressGeolocateField
              name={`primaryAddress`}
              label="Primary Address"
            />
          </RffConditional>
          <RffConditional
            operatorForMultiple={"OR"}
            rules={[
              {
                field: `citizenshipStatus`,
                operator: "==",
                value: "Foreign National Non-Resident",
              },
              {
                field: `citizenshipStatus`,
                operator: "==",
                value: "Other - Options do not apply",
              },
            ]}
          >
            <RffTextField
              name={`nonUSborrowerAddress`}
              label="Enter non-US address"
            />
          </RffConditional>
          <RffSelectToggleField
            size={6}
            name={`maritalStatus`}
            label="Marital Status"
            options={["Married", "Not Married"]}
          />
          <RffBooleanToggleField
            name={`borrowerHasSSN`}
            size={6}
            label="Does the borrower have a US issued SSN?"
          />
          <RffConditional field={`borrowerHasSSN`} value={true}>
            <RffSsnField name={`borrowerSSN`} label="Social Security Number" />
          </RffConditional>
        </RffGroup>

        {/* BORROWER BACKGROUND STEP */}
        <RffGroup title="Borrower Background" titleType="h3">
          <RffDollarField
            name={`cashLiquidity`}
            label="Total cash liquidity in personal and/or entity bank accounts"
            //
          />
          <RffDollarField
            name={`otherLiquidity`}
            label="Total value of other liquidity sources"
            helperText="Including money market/securities account, cash value of life insurance policies, IRA or 401k accounts"
          />
          <RffSelectToggleField
            name={`estimatedFICO`}
            label="Borrower estimated FICO range"
            options={[
              "Below 600",
              "600-620",
              "620-650",
              "650-680",
              "680-700",
              "700-720",
              "Greater than 720",
              "N/A do not have FICO",
            ]}
          />
          <RffBooleanToggleField
            name={`application_felony_conviction`}
            label="Has the borrower ever been convicted of a felony?"
          />
          <RffBooleanToggleField
            name={`application_financial_fraud_misdemeanor`}
            label="Has the borrower ever been convicted of any financial or fraud related crimes including misdemeanors?"
          />
          <RffBooleanToggleField
            name={`bankruptcy_flag`}
            label="Has the borrower filed for bankruptcy in the last 5 years?"
          />
          <RffBooleanToggleField
            name={`firstTimeHomebuyer`}
            label="Has the borrower ever owned a primary residence?"
          />
        </RffGroup>

        <RffGroup
          title="Does the borrower have any of the following open:"
          titleType="h3"
        >
          <RffBooleanToggleField
            name={`open_liens_judgments`}
            label="Charge offs, federal or state tax liens, pending litigation or financial judgments"
          />
          <RffConditional field={`open_liens_judgments`} value={true}>
            <RffGroup
              titleType="h3"
              disableGrid
              isGridChild
              title="Select All That Apply"
              sx={rffDependentGroupStyles}
            >
              <RffBooleanCheckbox
                suppressGrid
                name={`charge_offs`}
                label="Charge Offs"
              />
              <RffBooleanCheckbox
                suppressGrid
                name={`tax_liens`}
                label="Tax Liens"
              />
              <RffBooleanCheckbox
                suppressGrid
                name={`financial_judgements`}
                label="Financial Judgements"
                options={[
                  "Charge Offs",
                  "Tax Liens",
                  "Financial Judgements",
                  "Pending Litigation",
                ]}
              />
              <RffBooleanCheckbox
                suppressGrid
                name={`pending_litigation`}
                label="Pending Litigation"
              />
            </RffGroup>
          </RffConditional>
        </RffGroup>
        <RffGroup
          title="Do any of the following apply in the last three years:"
          titleType="h3"
        >
          <RffSelectMultipleField
            name="housing_events"
            label="Entered into a loan forbearance or modification program, a property  owned as individual or through an entity under your control subject to lis pendens or foreclosure or any mortgage lates?"
            options={selectOptionsHousingEvents}
            helperText="Select all that apply"
          />

          <RffSelectToggleField
            name="time_since_housing_event"
            label="Time Since Last Housing Event"
            options={[
              "Within the last 12-months",
              "Within the last 2-years",
              "Greater than 2-years ago",
            ]}
          />
          {/* <RffBooleanToggleField
            name={`housing_events`}
            label="Entered into a loan forbearance or modification program, a property  owned as individual or through an entity under your control subject to lis pendens or foreclosure or any mortgage lates?"
          />
          <RffConditional field={`housing_events`} value={true}>
            <RffSelectToggleField
              name={`time_since_housing_event`}
              label="Time Since Last Housing Event"
              options={[
                "Within the last 12-months",
                "Within the last 2-years",
                "Greater than 2-years ago",
              ]}
            />
            <RffGroup
              sx={rffDependentGroupStyles}
              titleType="h3"
              disableGrid
              isGridChild
              title="Select All That Apply"
            >
              <RffBooleanCheckbox
                suppressGrid
                name={`forbearance_or_modification`}
                label="Forbearance or Modification"
              />
              <RffBooleanCheckbox
                suppressGrid
                name={`mortgage_lates`}
                label="Mortgage Lates"
              />
              <RffBooleanCheckbox
                suppressGrid
                name={`foreclosure`}
                label="Lis Pendens or Foreclosure"
              />
            </RffGroup>
          </RffConditional> */}
        </RffGroup>

        <RffGroup
          titleType="h3"
          title="Does the borrower have experience with:"
        >
          <RffBooleanToggleField
            name={`hasExperienceWithIncomeProducingProperties`}
            label="Income Producing Properties"
            size={4}
          />

          <RffBooleanToggleField
            name={`hasExperienceWithFixFlips`}
            label="Fix & Flips"
            size={4}
          />

          <RffBooleanToggleField
            name={`hasExperienceWithGroundUpConstruction`}
            label="Ground Up Construction"
            size={4}
          />
          <RffLoanBorrowerExperienceTable
            label="Please include previous experience for the following:"
            // name={fieldName}
          />
          <RffTextareaField
            name={`borrowerExperienceSummary`}
            label="Summary of borrower property investor experience"
          />
        </RffGroup>
      </RffForm>
    </DrilldownSidebarPane>
  );
});

export default DrilldownSidebarAddBorrower;
