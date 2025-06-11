import {
  DeleteOutline,
  ExpandMoreRounded,
  PersonAddOutlined,
  PersonOutline,
} from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  IconButton,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React from "react";
import { useForm } from "react-final-form";
import { FieldArray } from "react-final-form-arrays";
import RffLoanBorrowerExperienceTable from "../../components/finalForm/features/RffLoanBorrowerExperienceTable";
import RffAddressGeolocateField from "../../components/finalForm/inputs/RffAddressGeolocateField";
import RffBooleanCheckbox from "../../components/finalForm/inputs/RffBooleanCheckbox";
import RffBooleanToggleField from "../../components/finalForm/inputs/RffBooleanToggleField";
import RffDateField from "../../components/finalForm/inputs/RffDateField";
import RffDollarField from "../../components/finalForm/inputs/RffDollarField";
import RffEmailField from "../../components/finalForm/inputs/RffEmailField";
import RffPhoneField from "../../components/finalForm/inputs/RffPhoneField";
import RffSelectToggleField from "../../components/finalForm/inputs/RffSelectToggleField";
import RffSsnField from "../../components/finalForm/inputs/RffSsnField";
import RffTextareaField from "../../components/finalForm/inputs/RffTextareaField";
import RffTextField from "../../components/finalForm/inputs/RffTextField";
import RffConditional from "../../components/finalForm/shared/RffConditional";
import RffGroup from "../../components/finalForm/shared/RffGroup";
import Flx from "../../components/layout/Flx";
import Txt from "../../components/typography/Txt";
import TitledCard from "../../components/ui/TitledCard/TitledCard";
import { rffDependentGroupStyles } from "../../styles/rffDependentGroupStyles";

const BorrowersSection = ({ testing }) => {
  const [expanded, setExpanded] = React.useState(0);

  const { change } = useForm();
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const onCitizenshipStatusChange = (fieldName, v) => {
    if (v === "US Citizen") {
      change(`${fieldName}.borrowerHasSSN`, true);
    } else {
      change(`${fieldName}.borrowerHasSSN`, false);
    }
  };

  return (
    <TitledCard
      collapsable
      icon={<PersonOutline className="thin" />}
      variant="h1"
      title="Loan Borrowers"
    >
      <RffGroup
        suppressBottomMargin
        disableGrid
        // titleType="h2"
        // title="Loan Borrowers"
      >
        <FieldArray name={"borrowers"}>
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
                          borderBottom: "1px solid #dde0e4",
                          background: grey[50],
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
                            {`Borrower #${index + 1}`}
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
                        {/* START BORROWER */}
                        <RffGroup>
                          <RffTextField
                            name={`${fieldName}.firstName`}
                            label="First Name"
                            size={6}
                            required={testing?.required}
                          />
                          <RffTextField
                            name={`${fieldName}.lastName`}
                            label="Last Name"
                            size={6}
                            required={testing?.required}
                          />
                          <RffEmailField
                            size={4}
                            name={`${fieldName}.emailAddress`}
                            label="Email"
                            required={testing?.required}
                          />
                          <RffPhoneField
                            size={4}
                            name={`${fieldName}.phone`}
                            label="Phone"
                            required={testing?.required}
                          />

                          <RffDateField
                            size={4}
                            name={`${fieldName}.dateOfBirth`}
                            label="Date of birth"
                            required={testing?.required}
                          />

                          <RffSelectToggleField
                            name={`${fieldName}.citizenshipStatus`}
                            label="Borrower Citizenship"
                            onChange={(v) =>
                              onCitizenshipStatusChange(fieldName, v)
                            }
                            options={[
                              "US Citizen",
                              "Foreign National with SSN",
                              "Foreign National",
                              "Foreign National Non-Resident",
                              "Other - Options do not apply",
                            ]}
                            required={testing?.required}
                          />

                          <RffConditional
                            testing={testing}
                            operatorForMultiple={"OR"}
                            rules={[
                              {
                                field: `${fieldName}.citizenshipStatus`,
                                operator: "==",
                                value: "US Citizen",
                              },
                              {
                                field: `${fieldName}.citizenshipStatus`,
                                operator: "==",
                                value: "Foreign National with SSN",
                              },
                              {
                                field: `${fieldName}.citizenshipStatus`,
                                operator: "==",
                                value: "Foreign National",
                              },
                            ]}
                          >
                            <RffAddressGeolocateField
                              name={`${fieldName}.primaryAddress`}
                              label="Primary Address"
                              required={testing?.required}
                            />
                          </RffConditional>
                          <RffConditional
                            testing={testing}
                            operatorForMultiple={"OR"}
                            rules={[
                              {
                                field: `${fieldName}.citizenshipStatus`,
                                operator: "==",
                                value: "Foreign National Non-Resident",
                              },
                              {
                                field: `${fieldName}.citizenshipStatus`,
                                operator: "==",
                                value: "Other - Options do not apply",
                              },
                              // {
                              //   field: `${fieldName}.citizenshipStatus`,
                              //   operator: "==",
                              //   value: undefined,
                              // },
                            ]}
                          >
                            <RffTextField
                              name={`${fieldName}.nonUSborrowerAddress`}
                              label="Enter non-US address"
                            />
                          </RffConditional>
                          <RffSelectToggleField
                            size={4}
                            name={`${fieldName}.maritalStatus`}
                            label="Marital Status"
                            options={["Married", "Not Married"]}
                            required={testing?.required}
                          />
                          <RffBooleanToggleField
                            name={`${fieldName}.borrowerHasSSN`}
                            size={4}
                            label="Does the borrower have a US issued SSN?"
                            required={testing?.required}
                          />
                          <RffConditional
                            testing={testing}
                            field={`${fieldName}.borrowerHasSSN`}
                            value={true}
                          >
                            <RffSsnField
                              size={4}
                              name={`${fieldName}.borrowerSSN`}
                              label="Social Security Number"
                            />
                          </RffConditional>
                        </RffGroup>

                        {/* BORROWER BACKGROUND STEP */}
                        <RffGroup title="Borrower Background" titleType="h3">
                          <RffDollarField
                            name={`${fieldName}.cashLiquidity`}
                            label="Total cash liquidity in personal and/or entity bank accounts"
                            // required={testing?.required}
                          />
                          <RffDollarField
                            name={`${fieldName}.otherLiquidity`}
                            label="Total value of other liquidity sources"
                            helperText="Including money market/securities account, cash value of life insurance policies, IRA or 401k accounts"
                          />
                          <RffSelectToggleField
                            name={`${fieldName}.estimatedFICO`}
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
                            required={testing?.required}
                          />
                          <RffBooleanToggleField
                            name={`${fieldName}.application_felony_conviction`}
                            label="Has the borrower ever been convicted of a felony?"
                            required={testing?.required}
                          />
                          <RffBooleanToggleField
                            name={`${fieldName}.application_financial_fraud_misdemeanor`}
                            label="Has the borrower ever been convicted of any financial or fraud related crimes including misdemeanors?"
                            required={testing?.required}
                          />
                          <RffBooleanToggleField
                            name={`${fieldName}.bankruptcy_flag`}
                            label="Has the borrower filed for bankruptcy in the last 5 years?"
                            required={testing?.required}
                          />
                          <RffBooleanToggleField
                            name={`${fieldName}.firstTimeHomebuyer`}
                            label="Has the borrower ever owned a primary residence?"
                            required={testing?.required}
                          />
                        </RffGroup>

                        <RffGroup
                          title="Does the borrower have any of the following open:"
                          titleType="h3"
                        >
                          <RffBooleanToggleField
                            name={`${fieldName}.open_liens_judgments`}
                            label="Charge offs, federal or state tax liens, pending litigation or financial judgments"
                            required={testing?.required}
                          />
                          <RffConditional
                            testing={testing}
                            field={`${fieldName}.open_liens_judgments`}
                            value={true}
                          >
                            <RffGroup
                              titleType="h3"
                              disableGrid
                              isGridChild
                              title="Select All That Apply"
                              sx={rffDependentGroupStyles}
                            >
                              <RffBooleanCheckbox
                                suppressGrid
                                name={`${fieldName}.charge_offs`}
                                label="Charge Offs"
                              />
                              <RffBooleanCheckbox
                                suppressGrid
                                name={`${fieldName}.tax_liens`}
                                label="Tax Liens"
                              />
                              <RffBooleanCheckbox
                                suppressGrid
                                name={`${fieldName}.financial_judgements`}
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
                                name={`${fieldName}.pending_litigation`}
                                label="Pending Litigation"
                              />
                            </RffGroup>
                          </RffConditional>
                        </RffGroup>
                        <RffGroup
                          title="Do any of the following apply in the last three years:"
                          titleType="h3"
                        >
                          <RffBooleanToggleField
                            name={`${fieldName}.housing_events`}
                            label="Entered into a loan forbearance or modification program, a property  owned as individual or through an entity under your control subject to lis pendens or foreclosure or any mortgage lates?"
                            required={testing?.required}
                          />
                          <RffConditional
                            testing={testing}
                            field={`${fieldName}.housing_events`}
                            value={true}
                          >
                            <RffSelectToggleField
                              name={`${fieldName}.time_since_housing_event`}
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
                                name={`${fieldName}.forbearance_or_modification`}
                                label="Forbearance or Modification"
                              />
                              <RffBooleanCheckbox
                                suppressGrid
                                name={`${fieldName}.mortgage_lates`}
                                label="Mortgage Lates"
                              />
                              <RffBooleanCheckbox
                                suppressGrid
                                name={`${fieldName}.foreclosure`}
                                label="Lis Pendens or Foreclosure"
                              />
                            </RffGroup>
                          </RffConditional>
                        </RffGroup>

                        <RffGroup
                          titleType="h3"
                          title="Does the borrower have experience with:"
                        >
                          <RffBooleanToggleField
                            name={`${fieldName}.hasExperienceWithIncomeProducingProperties`}
                            label="Income Producing Properties"
                            size={4}
                          />

                          <RffBooleanToggleField
                            name={`${fieldName}.hasExperienceWithFixFlips`}
                            label="Fix & Flips"
                            size={4}
                          />

                          <RffBooleanToggleField
                            name={`${fieldName}.hasExperienceWithGroundUpConstruction`}
                            label="Ground Up Construction"
                            size={4}
                          />
                          <RffLoanBorrowerExperienceTable
                            label="Please include previous experience for the following:"
                            name={fieldName}
                          />
                          <RffTextareaField
                            name={`${fieldName}.borrowerExperienceSummary`}
                            label="Summary of borrower property investor experience"
                            minHeight="100px"
                            placeholder="Please briefly describe the borrower's experience"
                          />
                        </RffGroup>
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
                    // size="medium"
                    // color="inherit"
                    fullWidth
                    startIcon={<PersonAddOutlined />}
                    onClick={() => {
                      arrayFields.push({});
                    }}
                  >
                    Add Borrower
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
        {/* <Divider /> */}
      </RffGroup>
    </TitledCard>
  );
};

export default BorrowersSection;
