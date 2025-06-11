import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import RffBooleanCheckbox from "../../../../components/finalForm/inputs/RffBooleanCheckbox";
import RffDateField from "../../../../components/finalForm/inputs/RffDateField";
import RffEmailField from "../../../../components/finalForm/inputs/RffEmailField";
import RffSelectMultipleField from "../../../../components/finalForm/inputs/RffSelectMultipleField";
import RffTextareaField from "../../../../components/finalForm/inputs/RffTextareaField";
import RffTextField from "../../../../components/finalForm/inputs/RffTextField";
import RffForm from "../../../../components/finalForm/RffForm";
import RffGroup from "../../../../components/finalForm/shared/RffGroup";
import { selectOptionsExceptionCategory } from "../../../../constants/selectOptions/selectOptionsExceptionCategory";
import { selectOptionsExceptionReference } from "../../../../constants/selectOptions/selectOptionsExceptionCategory copy";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import { sidebarClear } from "../../../../redux/actions/sidebarActions";
import DrilldownSidebarPane from "../DrilldownSidebarPane";
import RffBooleanToggleField from "../../../../components/finalForm/inputs/RffBooleanToggleField";

const DrilldownSidebarAddException = memo(() => {
  const loan = useSelector((state) => state.loanDrilldown);
  const { createLoanException, loading } = useUnderwritingHook();
  const dispatch = useDispatch();
  const onSubmit = (values) => {
    // createBorrower({
    //   loanId: loan?._id,
    //   borrower: values,
    //   onSuccessFn: (response) => {
    //     dispatch(loanDrilldownSet(response));
    //     dispatch(sidebarClear());
    //   },
    // });

    // console.log("values", values);
    // return;
    createLoanException({
      loanId: loan?._id,
      data: values,
      onSuccessFn: (response) => {
        dispatch(loanDrilldownSet(response));
        dispatch(sidebarClear());
      },
    });
  };

  // const ex = {
  //   exceptionCategory: ["Subject Property", "Leverage"],
  //   exceptionReference: ["Internal Guideline", "Leverage & Pricing Grid"],
  //   exceptionGuideline:
  //     "Property exceeds maximum square footage of 5,000 sq ft as per internal guideline LTV-2023-4. Additionally, the LTV ratio of 85% exceeds the standard maximum of 80% for investment properties in this price range.",
  //   exceptionApprovalBy: "john.smith@lendercompany.com",
  //   exceptionApprovalNote:
  //     "Exception approved by Credit Committee during weekly review on April 10, 2025. John Smith cited strong borrower financial profile and property location in high-growth market as deciding factors.",
  //   exceptionApprovalByCounterparty: true,
  //   counterparty: "FirstBank Capital",
  //   exceptionDate: "2025-04-10T14:30:00Z",
  //   compensatingFactors:
  //     "Borrower has excellent credit score (820+), significant liquid reserves (12 months PITI), and strong history with lender (3 previous loans, all paid as agreed). Property is located in primary market with consistent appreciation over past 5 years averaging 6% annually.",
  //   pricingConcession:
  //     "Rate increased by 25 basis points from standard offering to offset additional risk. Origination fee increased from 1.0% to 1.25%.",
  // };
  return (
    <DrilldownSidebarPane
      title="Add Loan Exception"
      maxWidth="40vw"
      initialWidth={"700px"}
      variant="fixed"
    >
      <RffForm onSubmit={onSubmit} loading={loading}>
        <RffGroup gap={0}>
          <RffSelectMultipleField
            // array
            name="exceptionCategory"
            label="Exception Category"
            options={selectOptionsExceptionCategory}
          />
          <RffSelectMultipleField
            // array
            name="exceptionReference"
            label="Exception Reference"
            options={selectOptionsExceptionReference}
          />
          <RffTextareaField
            name="exceptionGuideline"
            label="Exception Guideline"
            helperText="Summary or excerpt of the guideline being overridden."
          />
          <RffEmailField
            // list of user emails?
            name="exceptionApprovalBy"
            label="Exception Approval By"
            type="email"
            helperText="Email of the user who officially approved the exception."
          />

          <RffTextareaField
            name="exceptionApprovalNote"
            label="Exception Approval Note"
            helperText="Details about the approval. If an internal source stated who approved, note it here."
          />

          <RffBooleanToggleField
            name="exceptionApprovalByCounterparty"
            label="Approval By Counterparty"
            // helperText="Whether the external counterparty also confirmed approval."
          />

          <RffTextField
            name="counterparty"
            label="Counterparty"
            // required
            helperText="If the loan is to be sold or transferred, the name of the counterparty."
          />

          <RffDateField name="exceptionDate" label="Exception Date" />

          <RffTextareaField
            name="compensatingFactors"
            label="Compensating Factors"
            helperText="Factors that help mitigate or support the exception."
          />
          <RffTextareaField
            name="pricingConcession"
            label="Pricing Concession"
            helperText="If a pricing concession was agreed upon, detail it here."
          />
        </RffGroup>
      </RffForm>
    </DrilldownSidebarPane>
  );
});

export default DrilldownSidebarAddException;
