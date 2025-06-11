import {
  AddBusinessOutlined,
  DeleteOutline,
  ExpandMoreRounded,
  StoreOutlined,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { get, isNil } from "lodash";
import React, { useMemo } from "react";
import { useForm, useFormState } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import RffAddressGeolocateField from "../../components/finalForm/inputs/RffAddressGeolocateField";
import RffBooleanCheckbox from "../../components/finalForm/inputs/RffBooleanCheckbox";
import RffBooleanToggleField from "../../components/finalForm/inputs/RffBooleanToggleField";
import RffDateField from "../../components/finalForm/inputs/RffDateField";
import RffDollarField from "../../components/finalForm/inputs/RffDollarField";
import RffNumberField from "../../components/finalForm/inputs/RffNumberField";
import RffPercentField from "../../components/finalForm/inputs/RffPercentField";
import RffSelectField from "../../components/finalForm/inputs/RffSelectField";
import RffSelectToggleField from "../../components/finalForm/inputs/RffSelectToggleField";
import RffConditional from "../../components/finalForm/shared/RffConditional";
import RffGroup from "../../components/finalForm/shared/RffGroup";
import Flx from "../../components/layout/Flx";
import Txt from "../../components/typography/Txt";
import TitledCard from "../../components/ui/TitledCard/TitledCard";
import { selectOptionsPropertyConditionAtOrigination } from "../../constants/selectOptions/selectOptionsPropertyConditionAtOrigination";
import RffSelectRadioField from "../../components/finalForm/inputs/RffSelectRadioField";

const PropertiesSection = ({ testing }) => {
  const [expanded, setExpanded] = React.useState(0);
  const { values } = useFormState();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const { change } = useForm();

  const onAddressChange = (address) => {
    const propertyName = address?.fullAddress;
    if (isNil(values?.loanName) && propertyName) {
      change(`loanName`, propertyName);
    }
  };
  return (
    <TitledCard
      collapsable
      icon={<StoreOutlined className="thin" />}
      variant="h1"
      title="Loan Properties"
    >
      <RffGroup disableGrid suppressBottomMargin>
        <FieldArray name={"subjectProperties"}>
          {({ fields: arrayFields, meta }) => {
            return (
              <React.Fragment>
                {arrayFields.map((fieldName, index) => (
                  <React.Fragment key={fieldName}>
                    <Accordion
                      onChange={handleChange(index)}
                      expanded={expanded === index}
                      sx={{
                        m: "0 !important",
                        borderRadius: "4px",
                        boxShadow: "0 0 0px 1px #dde0e4",
                        overflow: "hidden",
                      }}
                    >
                      <AccordionSummary
                        sx={{
                          background: grey[50],
                          borderBottom: "1px solid #dde0e4",
                        }}
                        expandIcon={
                          <ExpandMoreRounded sx={{ color: "#232a31" }} />
                        }
                      >
                        <Flx fw jb ac sx={{ color: "#232a31" }}>
                          <Txt
                            bold
                            variant="subtitle2"
                            sx={{ color: "inherit" }}
                          >
                            {`Property #${index + 1}`}
                          </Txt>
                          <IconButton
                            sx={{ color: "inherit" }}
                            onClick={() => arrayFields.remove(index)}
                            size="small"
                          >
                            <DeleteOutline fontSize="small" />
                          </IconButton>
                        </Flx>
                      </AccordionSummary>
                      <AccordionDetails sx={{ background: "#ffffff", p: 2.8 }}>
                        <RffGroup>
                          <RffAddressGeolocateField
                            name={`${fieldName}.address`}
                            label="Enter the subject property address"
                            onChange={onAddressChange}
                            required
                          />

                          <PropertValueRow fieldName={fieldName} />

                          <RffConditional
                            field="loanProductType"
                            operator="includes"
                            value={["Fix and Flip", "Ground Up Construction"]}
                          >
                            <RffDollarField
                              // size={6}
                              name={`${fieldName}.constructionBudget`}
                              label="Total construction budget for the project including hard and soft costs"
                            />
                            <RffPercentField
                              // size={6}
                              name={`${fieldName}.financedBudgetPercent`}
                              label="Requested total percent of construction budget to be financed"
                            />
                          </RffConditional>
                          <RffConditional
                            field="loanPurpose"
                            value={"Purchase"}
                          >
                            <RffDollarField
                              name={`${fieldName}.assignmentFees`}
                              label="Dollar value of any assignment fees included in purchase contract"
                            />
                            <RffDollarField
                              name={`${fieldName}.sellersConcession`}
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
                              name={`${fieldName}.additionalBasis`}
                              label="Any additional costs expended since purchase including costs for permits & plans, land development, renovations. Do not include taxes, insurance, interest expense or other carrying costs"
                            />
                          </RffConditional>
                        </RffGroup>
                        <PropertyPurchase fieldName={fieldName} />
                        <PropertyConditionSection fieldName={fieldName} />
                        <TaxesSection fieldName={fieldName} />
                      </AccordionDetails>
                    </Accordion>
                  </React.Fragment>
                ))}

                <Flx
                  center
                  fw
                  item
                  sx={{
                    color: "#232a31",
                  }}
                >
                  <Button
                    variant="text"
                    fullWidth
                    startIcon={<AddBusinessOutlined />}
                    onClick={() => {
                      arrayFields.push({});
                    }}
                  >
                    Add Property
                  </Button>
                  {meta.touched && typeof meta.error === "string" && (
                    <div style={{ color: "red", marginTop: "4px" }}>
                      {meta.error}
                    </div>
                  )}
                </Flx>
              </React.Fragment>
            );
          }}
        </FieldArray>
      </RffGroup>
    </TitledCard>
  );
};

const PropertyPurchase = ({ fieldName }) => {
  const { values } = useFormState();

  if (values?.loanPurpose !== "Purchase") {
    return null;
  }

  return (
    <RffGroup titleType="h4" title="Property Purchase Details" suppressGrid>
      <RffConditional field="loanPurpose" value={"Purchase"}>
        <RffDollarField
          name={`${fieldName}.purchasePrice`}
          label="What is the property purchase price?"
          size={6}
        />
        <RffDateField
          size={6}
          name={`${fieldName}.purchaseDate`}
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
          name={`${fieldName}.originalPurchasePrice`}
          label="What was original purchase price for the property?"
        />
        <RffDateField
          name={`${fieldName}.originalPurchaseDate`}
          label="What was original purchase date of the property?"
        />
      </RffConditional>
    </RffGroup>
  );
};

const PropertValueRow = ({ fieldName }) => {
  const { values } = useFormState();

  const asIsValueSize = useMemo(() => {
    const lpt = values?.loanProductType;
    if (
      lpt === "Fix and Flip" ||
      lpt === "Ground Up Construction" ||
      lpt === "Vacant Land"
    ) {
      return 6;
    }
    return 12;
  }, [values?.loanProductType]);
  return (
    <>
      <RffDollarField
        name={`${fieldName}.asIsValue`}
        label="As-is or market value of the property"
        size={asIsValueSize}
        placeholder={"Please list the current estimated value"}
      />
      <RffConditional
        field="loanProductType"
        operator="includes"
        value={["Fix and Flip", "Ground Up Construction", "Vacant Land"]}
      >
        <RffDollarField
          name={`${fieldName}.arv`}
          size={6}
          label="After Renovation Value"
        />
      </RffConditional>
    </>
  );
};

const PropertyConditionSection = ({ fieldName }) => {
  return (
    <RffGroup titleType="h4" title="Property Condition & Details" suppressGrid>
      <RffSelectToggleField
        name={`${fieldName}.propertyType`}
        label="Property Type"
        options={[
          "SFR",
          "2-unit",
          "3-unit",
          "4-unit",
          "5-unit",
          "6-unit",
          "7-unit",
          "8-unit",
          "Condo",
          "Townhome",
          "Planned Unit Development (PUD)",
          "Multifamily",
          "Mixed-Use",
          "Commercial",
          "Undeveloped Land",
          "Other",
        ]}
      />

      <RffConditional
        field="loanProductType"
        operator="includes"
        value={["Ground Up Construction", "Vacant Land"]}
      >
        <RffSelectToggleField
          name={`${fieldName}.proposedPropertyType`}
          label="Proposed Property Type"
          options={[
            "SFR",
            "2-unit",
            "3-unit",
            "4-unit",
            "Condo",
            "Townhome",
            "Planned Unit Development (PUD)",
            "Multifamily (5+ Units)",
            "Mixed-Use",
            "Commercial",
            "Other",
          ]}
        />
      </RffConditional>
      <RffBooleanToggleField
        size={4}
        name={`${fieldName}.propertyRuralIndicator`}
        label="Is the property in a rural location?"
      />
      <RffBooleanToggleField
        size={4}
        name={`${fieldName}.floodZone`}
        label="Is the property in a flood zone?"
      />

      <PropertyListedForSaleRow fieldName={fieldName} />
      <PropertSquareFootageRow fieldName={fieldName} />
      <RffSelectToggleField
        name={`${fieldName}.propertyConditionAtOrigination`}
        label="Property Condition At Origination"
        options={selectOptionsPropertyConditionAtOrigination}
      />
      <RffConditional field="loanProductType" value={"Fix and Flip"}>
        <RffSelectRadioField
          name={`${fieldName}.ffPropertyStatus`}
          label="How would you describe the current property status for this fix and flip project?"
          options={[
            "Requires significant renovation",
            "Average condition - requires moderate renovation",
            "Above Average condition - requires limited renovation",
          ]}
        />
      </RffConditional>

      <RffConditional field="loanProductType" value={"Ground Up Construction"}>
        <RffSelectRadioField
          name={`${fieldName}.gucPropertyStatus`}
          label="How would you describe the current project status for this ground up project?"
          options={[
            "Raw land without approved plans and/or utilities",
            "Raw land with approved plans and utilities in place",
            "Foundation in place",
            "Significant Progress to Exterior, limited or no exterior work complete",
            "Finishing Interior",
          ]}
        />
      </RffConditional>
      {/* <PropertSquareFootageRow fieldName={fieldName} /> */}
    </RffGroup>
  );
};

const PropertyListedForSaleRow = ({ fieldName }) => {
  const { values } = useFormState();

  const residentialSqFootageSize = useMemo(() => {
    const lpt = values?.loanProductType;
    if (
      lpt === "Fix and Flip" ||
      lpt === "Ground Up Construction" ||
      lpt === "Vacant Land"
    ) {
      return 6;
    }

    return 12;
  }, [values?.loanProductType]);

  const isListed = useMemo(() => {
    const name = `${fieldName}.propertyListedForSale`;
    console.log("Name: ", name);
    const val = get(values, name);
    console.log("val: ", val);

    if (val === true || val === "true") {
      return true;
    }
    return false;
  }, [values?.subjectProperties, fieldName]);
  return (
    <>
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
          name={`${fieldName}.propertyListedForSale`}
          label="Property Listed For Sale"
          size={4}
        />
        {isListed ? (
          <>
            <RffDateField
              name={`${fieldName}.lastListedForSaleDate`}
              label="Last Listed For Sale Date"
              size={6}
            />
            <RffDollarField
              name={`${fieldName}.lastListedForSalePrice`}
              label="Last Listed For Sale Price"
              size={6}
            />
          </>
        ) : null}
      </RffConditional>
    </>
  );
};
const PropertSquareFootageRow = ({ fieldName }) => {
  const { values } = useFormState();

  const residentialSqFootageSize = useMemo(() => {
    const lpt = values?.loanProductType;
    if (
      lpt === "Fix and Flip" ||
      lpt === "Ground Up Construction" ||
      lpt === "Vacant Land"
    ) {
      return 6;
    }

    return 12;
  }, [values?.loanProductType]);
  return (
    <>
      <RffConditional
        field={`${fieldName}.propertyType`}
        operator={"includes"}
        value={["Mixed-Use", "Commercial", "Other"]}
      >
        <RffNumberField
          name={`${fieldName}.commercialSqFootage`}
          label="What is the commercial square footage of the property?"
        />
      </RffConditional>
      <RffNumberField
        name={`${fieldName}.residentialSqFootage`}
        label="Residential square footage of the property"
        size={residentialSqFootageSize}
      />
      <RffConditional
        field="loanProductType"
        operator="includes"
        value={["Fix and Flip", "Ground Up Construction", "Vacant Land"]}
      >
        <RffNumberField
          name={`${fieldName}.afterRenoSqFootage`}
          size={6}
          label="Square footage after the project is completed"
        />
      </RffConditional>
    </>
  );
};

const TaxesSection = ({ fieldName }) => {
  return (
    <RffGroup
      titleType="h4"
      title="Taxes, Insurance & Other Expenses"
      suppressGrid
    >
      <RffDollarField
        name={`${fieldName}.annualTaxes`}
        label="Annual Taxes"
        size={4}
      />
      <RffDollarField
        name={`${fieldName}.annualInsurance`}
        label="Annual Insurance"
        size={4}
      />
      <RffDollarField
        name={`${fieldName}.annualFloodInsurance`}
        label="Annual Flood Insurance"
        size={4}
      />
      <RffDollarField
        name={`${fieldName}.annualHoaFees`}
        label="Annual Hoa Fees"
        size={4}
      />

      <RffConditional
        field="loanProductType"
        operator="includes"
        value={["Stabilized Bridge", "30-Year Rental Loan"]}
      >
        <RffDollarField
          name={`${fieldName}.annualPropertyMgmtFees`}
          label="Annual Property Mgmt Fees"
          size={4}
        />
      </RffConditional>

      <RffDollarField
        name={`${fieldName}.annualOtherExpense`}
        label="Annual Other Expense"
        size={4}
      />
    </RffGroup>
  );
};

export default PropertiesSection;
