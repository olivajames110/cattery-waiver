import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import RffAddressGeolocateField from "../../../../components/finalForm/inputs/RffAddressGeolocateField";
import RffBooleanToggleField from "../../../../components/finalForm/inputs/RffBooleanToggleField";
import RffDateField from "../../../../components/finalForm/inputs/RffDateField";
import RffDollarField from "../../../../components/finalForm/inputs/RffDollarField";
import RffNumberField from "../../../../components/finalForm/inputs/RffNumberField";
import RffPercentField from "../../../../components/finalForm/inputs/RffPercentField";
import RffSelectField from "../../../../components/finalForm/inputs/RffSelectField";
import RffSelectToggleField from "../../../../components/finalForm/inputs/RffSelectToggleField";
import RffForm from "../../../../components/finalForm/RffForm";
import RffConditional from "../../../../components/finalForm/shared/RffConditional";
import RffGroup from "../../../../components/finalForm/shared/RffGroup";
import { selectOptionsPropertyConditionAtOrigination } from "../../../../constants/selectOptions/selectOptionsPropertyConditionAtOrigination";
import { selectOptionsPropertyType } from "../../../../constants/selectOptions/selectOptionsPropertyType";
import { useUnderwritingHook } from "../../../../hooks/useUnderwritingHook";
import { loanDrilldownSet } from "../../../../redux/actions/loanDrilldownActions";
import { sidebarClear } from "../../../../redux/actions/sidebarActions";
import DrilldownSidebarPane from "../DrilldownSidebarPane";

const DrilldownSidebarAddProperty = memo(() => {
  const loan = useSelector((state) => state.loanDrilldown);
  const { createSubjectProperty, loading } = useUnderwritingHook();
  const dispatch = useDispatch();

  const onSubmit = (values) => {
    createSubjectProperty({
      loanId: loan?._id,
      propertyData: values,
      onSuccessFn: (response) => {
        dispatch(loanDrilldownSet(response));
        dispatch(sidebarClear());
      },
    });
  };

  return (
    <DrilldownSidebarPane
      title="Add Property"
      maxWidth="40vw"
      initialWidth={"700px"}
      variant="fixed"
    >
      <RffForm formSpy onSubmit={onSubmit} loading={loading}>
        <RffGroup>
          <RffAddressGeolocateField
            name={`address`}
            label="Enter the subject property address"
          />
          <RffSelectToggleField
            name={`propertyType`}
            label="Property Type"
            options={selectOptionsPropertyType}
          />
          <RffConditional
            field="loanProductType"
            operator="includes"
            value={["Ground Up Construction", "Vacant Land"]}
          >
            <RffSelectField
              name={`proposedPropertyType`}
              label="Proposed Property Type"
              options={selectOptionsPropertyType}
            />
          </RffConditional>
          <RffDollarField
            name={`asIsValue`}
            label="The current estimated as-is or market value of the property"
          />
          <RffConditional
            field="loanProductType"
            operator="includes"
            value={["Fix and Flip", "Ground Up Construction", "Vacant Land"]}
          >
            <RffDollarField name={`arv`} label="After Renovation Value" />
          </RffConditional>

          <RffConditional field="loanPurpose" value={"Purchase"}>
            <RffDollarField
              name={`purchasePrice`}
              label="What is the property purchase price?"
            />
            <RffDateField
              name={`purchaseDate`}
              label="What is the expected purchase date for the property?"
            />
          </RffConditional>

          <RffConditional
            field="loanPurpose"
            operator={"includes"}
            value={[
              "Refinance - No Cash Out",
              "Refinance - Cash Out",
              "Delayed Purchase",
            ]}
          >
            <RffDateField
              name={`originalPurchasePrice`}
              label="What was original purchase price for the property?"
            />
            <RffDateField
              name={`originalPurchaseDate`}
              label="What was original purchase date of the property?"
            />
          </RffConditional>
          <RffConditional field="loanPurpose" value={"Purchase"}>
            <RffDollarField
              name={`assignmentFees`}
              label="Dollar value of any assignment fees included in purchase contract"
            />
            <RffDollarField
              name={`sellersConcession`}
              label="Dollar value of any seller's concession included in purchase contract"
            />
          </RffConditional>
          <RffConditional
            field="loanProductType"
            operator={"includes"}
            operatorForMultiple="AND"
            rules={[
              {
                field: "loanProductType",
                operator: "includes",
                value: [
                  "Fix and Flip",
                  "Ground Up Construction",
                  "Vacant Land",
                ],
              },
              {
                field: "loanPurpose",
                operator: "includes",
                value: [
                  "Refinance - No Cash Out",
                  "Refinance - Cash Out",
                  "Delayed Purchase",
                ],
              },
            ]}
          >
            <RffDollarField
              name={`additionalBasis`}
              label="Any additional costs expended since purchase including costs for permits & plans, land development, renovations. Do not include taxes, insurance, interest expense or other carrying costs"
            />
          </RffConditional>
          <RffConditional
            field="loanPurpose"
            operator={"includes"}
            value={[
              "Refinance - No Cash Out",
              "Refinance - Cash Out",
              "Delayed Purchase",
            ]}
          >
            <RffBooleanToggleField
              name={`propertyListedForSale`}
              label="Property Listed For Sale"
            />
            <RffDateField
              name={`lastListedForSaleDate`}
              label="Last Listed For Sale Date"
            />
            <RffDollarField
              name={`lastListedForSalePrice`}
              label="Last Listed For Sale Price"
            />
          </RffConditional>
          <RffBooleanToggleField
            name={`floodZone`}
            label="Is the property in a flood zone?"
          />
          <RffNumberField
            name={`residentialSqFootage`}
            label="What is the residential square footage of the property?"
          />
          {/* TO FIX - Make nested conditionals work */}
          <RffConditional
            field={`propertyType`}
            operator={"includes"}
            value={["Mixed-Use", "Commercial", "Other"]}
          >
            <RffNumberField
              name={`commercialSqFootage`}
              label="What is the commercial square footage of the property?"
            />
          </RffConditional>
          <RffConditional
            field="loanProductType"
            operator="includes"
            value={["Fix and Flip", "Ground Up Construction", "Vacant Land"]}
          >
            <RffNumberField
              name={`afterRenoSqFootage`}
              label="If renovating, the square footage after the project is completed"
            />
          </RffConditional>

          <RffDollarField name={`annualTaxes`} label="Annual Taxes" size={6} />
          <RffDollarField
            name={`annualInsurance`}
            label="Annual Insurance"
            size={6}
          />
          <RffDollarField
            name={`annualFloodInsurance`}
            label="Annual Flood Insurance"
            size={6}
          />
          <RffDollarField
            name={`annualHoaFees`}
            label="Annual Hoa Fees"
            size={6}
          />

          <RffConditional
            field="loanProductType"
            operator="includes"
            value={["Stabilized Bridge", "30-Year Rental Loan"]}
          >
            <RffDollarField
              name={`annualPropertyMgmtFees`}
              label="Annual Property Mgmt Fees"
              size={6}
            />
          </RffConditional>
          {/* <div>---------------------------------------</div> */}
          {/* Do the following need to have conditional values? */}
          <RffDollarField
            name={`annualOtherExpense`}
            label="Annual Other Expense"
            size={6}
          />
          <RffSelectToggleField
            name={`propertyConditionAtOrigination`}
            label="Property Condition At Origination"
            options={selectOptionsPropertyConditionAtOrigination}
          />
          <RffSelectField
            name={`ffPropertyStatus`}
            label="How would you describe the current property status for this fix and flip project?"
            options={[
              "Requires significant renovation",
              "Average condition - requires moderate renovation",
              "Above Average condition - requires limited renovation",
            ]}
          />
          <RffSelectField
            name={`gucPropertyStatus`}
            label="How would you describe the current project status for this ground up project?"
            options={[
              "Raw land without approved plans and/or utilities",
              "Raw land with approved plans and utilities in place",
              "Foundation in place",
              "Significant Progress to Exterior, limited or no exterior work complete",
              "Finishing Interior",
            ]}
          />
          <RffDollarField
            name={`constructionBudget`}
            label="Total construction budget for the project including hard and soft costs"
          />
          <RffPercentField
            name={`financedBudgetPercent`}
            label="What is the requested total percent of construction budget to be financed?"
          />
        </RffGroup>
      </RffForm>
    </DrilldownSidebarPane>
  );
});

export default DrilldownSidebarAddProperty;
