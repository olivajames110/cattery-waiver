import { InfoOutlined } from "@mui/icons-material";
import RffBooleanToggleField from "../../components/finalForm/inputs/RffBooleanToggleField";
import RffDateField from "../../components/finalForm/inputs/RffDateField";
import RffDollarField from "../../components/finalForm/inputs/RffDollarField";
import RffSelectField from "../../components/finalForm/inputs/RffSelectField";
import RffSelectMultipleUserEmailField from "../../components/finalForm/inputs/RffSelectMultipleUserEmailField";
import RffSelectRadioField from "../../components/finalForm/inputs/RffSelectRadioField";
import RffSelectUserEmailField from "../../components/finalForm/inputs/RffSelectUserEmailField";
import RffTextField from "../../components/finalForm/inputs/RffTextField";
import RffConditional from "../../components/finalForm/shared/RffConditional";
import RffGroup from "../../components/finalForm/shared/RffGroup";
import TitledCard from "../../components/ui/TitledCard/TitledCard";
import { selectOptionsLoanProductType } from "../../constants/selectOptions/selectOptionsLoanProductType";
import { selectOptionsLoanPurpose } from "../../constants/selectOptions/selectOptionsLoanPurpose";
import RffTextareaField from "../../components/finalForm/inputs/RffTextareaField";
import RffFloatField from "../../components/finalForm/inputs/RffFloatField";
import { selectOptionsPipelineType } from "../../constants/selectOptions/selectOptionsPipelineType";

const LoanDetailSection = ({ testing }) => {
  return (
    <TitledCard
      icon={<InfoOutlined className="thin" />}
      variant="h1"
      title="Loan Details"
      collapsable
    >
      <RffGroup
        suppressBottomMargin
        //
        // title="Loan Details"
      >
        <RffSelectUserEmailField
          size={4}
          name="salesperson"
          label="Assigned Salesperson"
        />
        <RffSelectMultipleUserEmailField
          name="permittedUsers"
          label="Permitted Users"
          size={8}
        />
        {/* <RffSelectUserEmailField
          size={4}
          name="loanProcessor"
          label="Loan Processor"
        />
        <RffSelectUserEmailField name="loanUnderwriter" label="Underwriter" /> */}

        <RffSelectRadioField
          name="loanProductType"
          label="Loan Product Type"
          options={selectOptionsLoanProductType}
          size={6}
          required={testing?.required}
        />
        <RffSelectRadioField
          name="loanPurpose"
          label="Loan Purpose"
          size={6}
          options={selectOptionsLoanPurpose}
          required={testing?.required}
        />
        <RffTextareaField
          name="exitStrategy"
          label="Exit Strategy"
          placeholder="Explain how the borrower plans to repay or exit this loan"
          minHeight={80}
          // placeholder="Describe your planned exit strategy, e.g. refinance within 12–18 months, sell to institutional buyer, or hold for cash flow"
          // placeholder="Explain how you plan to repay or exit this loan (e.g. refinance after stabilization, sale of asset, 1031 exchange)"
        />

        <RffDateField
          name="expectedClosingDate"
          label="What is the expected closing date for the loan?"
          required={testing?.required}
        />

        <RffConditional field="loanProductType" value="DSCR">
          <RffFloatField
            name="dscr"
            //
            label="The DSCR for the loan as measured by counterparty"
            // label="DSCR"
          />
          <RffDollarField
            name="totalInPlaceRents"
            size={6}
            label="Total In Place Rents"
            helperText="The total rents for the loan for all properties and all units per property"
          />
          <RffDollarField
            name="totalMarketRents"
            size={6}
            label="Total Market Rents"
            helperText="The total market rents for the loan for all properties and all units per property"
          />
        </RffConditional>

        <RffConditional
          testing={testing}
          operatorForMultiple={"OR"}
          rules={[
            {
              field: "loanProductType",
              operator: "==",
              value: "Stabilized Bridge",
            },
            {
              field: "loanProductType",
              operator: "==",
              value: "30-Year Rental Loan",
            },
            {
              field: "loanProductType",
              operator: "==",
              value: "Other",
            },
            {
              field: "loanProductType",
              operator: "==",
              value: "Foreclosure Bail Out",
            },
            {
              field: "loanProductType",
              operator: "==",
              value: "DSCR",
            },
          ]}
        >
          <RffDollarField name="baseLoanAmount" label="Requested Loan Amount" />
        </RffConditional>

        <RffConditional
          testing={testing}
          operatorForMultiple={"OR"}
          rules={[
            {
              field: "loanProductType",
              operator: "==",
              value: "Fix and Flip",
            },
            {
              field: "loanProductType",
              operator: "==",
              value: "Ground Up Construction",
            },
            {
              field: "loanProductType",
              operator: "==",
              value: "Vacant Land",
            },
          ]}
        >
          <RffDollarField
            size={4}
            name="baseLoanAmount"
            label="Initial loan amount"
            helperText="Amount before any draws"
          />
          <RffDollarField
            size={4}
            name="totalHoldback"
            label="Total financed budget"
            helperText="Total amount requested via draws"
          />
          {/* Render this only when totalHoldback < totalConstructionBudget */}
          <RffDollarField
            size={4}
            name="totalConstructionBudget"
            label="Total construction budget"
            helperText="The full project cost (if draws cover less than 100% of it)"
          />
          {/* <RffDollarField
            name="baseLoanAmount"
            label="Requested initial loan amount (baseLoanAmount)"
            helperText={"Financed amount before any financed budget"}
          />
          <RffDollarField
            name="totalHoldback"
            label="Requested financed budget amount"
          />
          <RffDollarField
            name="totalConstructionBudget"
            label="If the financed budget is less than 100% of the total construction budget for the project, please enter the total budget"
            helperText={
              "The total amount of the construction budget to be financed through draws"
            }
          /> */}
        </RffConditional>
      </RffGroup>
      <RffConditional
        testing={testing}
        field="loanPurpose"
        operator="includes"
        value={[
          "Refinance - No Cash Out",
          "Refinance - Cash Out",
          "Delayed Purchase",
        ]}
      >
        <RffGroup
          titleType="h3"
          sx={{ mt: 6 }}
          title="Refinanced Details"
          suppressBottomMargin
        >
          <RffConditional
            testing={testing}
            field="loanPurpose"
            operator="includes"
            value={[
              "Refinance - No Cash Out",
              "Refinance - Cash Out",
              "Delayed Purchase",
            ]}
          >
            <RffDollarField
              name="outstandingLoanUpb"
              label="Total principal amount of outstanding loan (this would be your expected payoff) :"
            />

            <RffTextField
              name="exisitingLender"
              label="What is the name of the current lender?"
            />
            <RffDateField
              name="existingLoanMaturityDate"
              label="Maturity date of existing loan :"
            />
            <RffBooleanToggleField
              name="existingLoanLatePayments"
              label="Have there ever been any payments made more than 30-days from due date on the existing loan?"
            />
            <RffBooleanToggleField
              name="existingLoanInDefault"
              label="Is the current loan in default (either payment or maturity default)?"
            />
            <RffConditional
              testing={testing}
              field="existingLoanInDefault"
              value={true}
            >
              <RffSelectField
                name="existingLoanDefaultType"
                label="Select existing loan default type:"
                options={["Maturity Default", "Payment Default"]}
              />
            </RffConditional>
            <RffBooleanToggleField
              name="existingLoanHasUndrawnBudget"
              label="Existing Loan Has Undrawn Budget"
            />
            <RffConditional
              testing={testing}
              field="existingLoanUndrawnBudgetAmount"
              value={true}
            >
              <RffDollarField
                name="existingLoanUndrawnBudgetAmount"
                label="Existing Loan Undrawn Budget Amount"
              />
            </RffConditional>
            <RffBooleanToggleField
              name="propertyListedForSale"
              label="Is the property currently listed for sale?"
            />
          </RffConditional>
          <RffConditional
            testing={testing}
            field="loanPurpose"
            operator="includes"
            value={["Refinance - No Cash Out", "Refinance - Cash Out"]}
          >
            <RffBooleanToggleField
              name="propertyListedForSaleLastSixMonths"
              label="Has the property been listed for sale in the last six months?"
            />
          </RffConditional>
        </RffGroup>
      </RffConditional>
    </TitledCard>
  );
};

export default LoanDetailSection;
