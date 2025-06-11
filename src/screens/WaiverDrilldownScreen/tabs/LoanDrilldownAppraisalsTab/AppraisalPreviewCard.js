import React, { useMemo, useState } from "react";
import TitledEditableFieldsRenderer from "../../../../components/common/TitledEditableFieldsRenderer";
import { Grid2 } from "@mui/material";
import RffLoanDataGroup from "../../../../components/finalForm/shared/RffLoanDataGroup";
import TablePreviewCard from "../../../../components/ui/TablePreviewCard";
import { isEmpty, isNil } from "lodash";

const AppraisalPreviewCard = ({ selected, onClose }) => {
  const data = useMemo(() => selected, [selected]);
  const [formSpy, setFormSpy] = useState(false);

  const [quickFilter, setQuickFilter] = useState(null);
  const cardTitle = data?.appraisalDocumentId;

  if (isNil(data) || isEmpty(data)) {
    return null;
  }
  return (
    <TablePreviewCard
      title={cardTitle}
      onClose={onClose}
      formSpy={formSpy}
      setFormSpy={setFormSpy}
      quickFilter={quickFilter}
      searchPlaceholder="Search in appraisal..."
      setQuickFilter={setQuickFilter}
    >
      <AppraisalFieldsGroup
        data={data}
        quickFilter={quickFilter}
        formSpy={formSpy}
      />
    </TablePreviewCard>
  );
};

const AppraisalFieldsGroup = ({ data, formSpy, quickFilter }) => {
  // 1. Identification & Valuation
  const identificationAndValuationGroup = useMemo(
    () => [
      {
        name: "oid",
        label: "Appraisal Unique Identifier",
        type: "text",
      },
      {
        name: "dealId",
        label: "Deal ID",
        type: "text",
      },
      {
        name: "subjectPropertyId",
        label: "Subject Property ID",
        type: "text",
      },
      {
        name: "appraisalDocumentId",
        label: "Appraisal Document ID",
        type: "text",
      },
      {
        name: "appraisalType",
        label: "Appraisal Type",
        type: "select",
        options: ["Form 1004", "Commercial", "Residential", "Other"],
      },
      {
        name: "appraisalARV",
        label: "After Repair Value (ARV)",
        type: "dollar",
      },
      {
        name: "appraisalAsIsValue",
        label: "As-Is Value",
        type: "dollar",
      },
      {
        name: "appraisalSubjectTo",
        label: "Appraisal Subject To",
        type: "booleanToggle",
      },
    ],
    []
  );

  // 2. Requirements & Special Conditions
  const requirementsAndSpecialConditionsGroup = useMemo(
    () => [
      {
        name: "appraisalRequirements",
        label: "Appraisal Requirements",
        type: "multiline",
        description: "Specific requirements (market rent, ARV, etc.)",
      },
      {
        name: "appraisalIsCommercial",
        label: "Commercial Appraisal",
        type: "booleanToggle",
      },
      {
        name: "appraisalIncludesScopeOfWork",
        label: "Includes Scope of Work",
        type: "booleanToggle",
      },
      {
        name: "appraisalIncludesMarketRents",
        label: "Includes Market Rents",
        type: "booleanToggle",
      },
    ],
    []
  );

  // 3. Ordering & Timeline
  const orderingAndTimelineGroup = useMemo(
    () => [
      {
        name: "orderDate",
        label: "Order Date",
        type: "date",
        description: "Date appraisal was ordered",
      },
      {
        name: "scheduleDate",
        label: "Scheduled Date",
        type: "date",
        description: "Date appraisal is scheduled to be conducted",
      },
      {
        name: "reportReceivedDate",
        label: "Report Received Date",
        type: "date",
        description: "Date the report was received",
      },
      {
        name: "appraisalValuationDate",
        label: "Original Valuation Date",
        type: "date",
      },
      {
        name: "appraisalRecertifiedDate",
        label: "Recertification Date",
        type: "date",
      },
      {
        name: "appraisalThroughLender",
        label: "Ordered Through Lender",
        type: "booleanToggle",
        description: "Appraisal ordered through another lender",
      },
      {
        name: "appraisalStage",
        label: "Appraisal Stage",
        type: "select",
        options: [
          "Not Ordered",
          "Ordered",
          "In Review",
          "Requested Change",
          "Final",
        ],
      },
    ],
    []
  );

  // 4. Contacts & Appraiser Info
  const contactsAndAppraiserInfoGroup = useMemo(
    () => [
      {
        name: "appraisalOwnerPointOfContact",
        label: "Appraisal Owner Contact",
        type: "text",
        description: "Contact for scheduling and property access",
      },
      {
        name: "appraisalManagementCompany",
        label: "Appraisal Management Company",
        type: "text",
      },
      {
        name: "orderedBy",
        label: "Ordered By",
        type: "email",
      },
      {
        name: "appraiser",
        label: "Appraiser Contact",
        type: "text",
      },
      {
        name: "appraiserLicenseNumber",
        label: "Appraiser License Number",
        type: "text",
      },
      {
        name: "appraiserLicenseExpirationDate",
        label: "Appraiser License Expiration",
        type: "date",
      },
    ],
    []
  );

  // 5. Review & Payment
  const reviewAndPaymentGroup = useMemo(
    () => [
      {
        name: "appraisalReviewNotes",
        label: "Review Notes",
        type: "multiline",
      },
      {
        name: "appraisalReviewDate",
        label: "Review Date",
        type: "date",
      },
      {
        name: "appraisalReviewed",
        label: "Appraisal Reviewed",
        type: "booleanToggle",
      },
      {
        name: "appraisalReviewedBy",
        label: "Reviewed By",
        type: "email",
      },
      {
        name: "appraisalCost",
        label: "Appraisal Cost",
        type: "dollar",
      },
      {
        name: "appraisalPaidFor",
        label: "Appraisal Paid",
        type: "booleanToggle",
      },
      {
        name: "appraisalPaidMethod",
        label: "Payment Method",
        type: "select",
        options: [
          "Borrower Paid Check",
          "Borrower Paid Credit Card",
          "Lender Paid",
        ],
      },
    ],
    []
  );

  return (
    <RffLoanDataGroup formSpy={formSpy} initialValues={data}>
      <Grid2 container spacing={8}>
        {/* 1. Identification & Valuation */}
        <Grid2 size={4}>
          <TitledEditableFieldsRenderer
            title="Appraisal Details & Valuation"
            quickFilter={quickFilter}
            fields={identificationAndValuationGroup}
          />
        </Grid2>

        {/* 2. Requirements & Special Conditions */}
        <Grid2 size={4}>
          <TitledEditableFieldsRenderer
            title="Requirements & Special Conditions"
            quickFilter={quickFilter}
            fields={requirementsAndSpecialConditionsGroup}
          />
        </Grid2>

        {/* 3. Ordering & Timeline */}
        <Grid2 size={4}>
          <TitledEditableFieldsRenderer
            title="Ordering & Timeline"
            quickFilter={quickFilter}
            fields={orderingAndTimelineGroup}
          />
        </Grid2>

        {/* 4. Contacts & Appraiser Info */}
        <Grid2 size={4}>
          <TitledEditableFieldsRenderer
            title="Contacts & Appraiser Info"
            quickFilter={quickFilter}
            fields={contactsAndAppraiserInfoGroup}
          />
        </Grid2>

        {/* 5. Review & Payment */}
        <Grid2 size={4}>
          <TitledEditableFieldsRenderer
            title="Review & Payment"
            quickFilter={quickFilter}
            fields={reviewAndPaymentGroup}
          />
        </Grid2>
      </Grid2>
    </RffLoanDataGroup>
  );
};
export default React.memo(AppraisalPreviewCard);
