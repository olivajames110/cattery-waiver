import React, { useEffect, useMemo, useState } from "react";
import TitledEditableFieldsRenderer from "../../../../components/common/TitledEditableFieldsRenderer";
import { Grid2 } from "@mui/material";
import RffLoanDataGroup from "../../../../components/finalForm/shared/RffLoanDataGroup";
import TablePreviewCard from "../../../../components/ui/TablePreviewCard";
import { isEmpty, isNil } from "lodash";
import TitledGroup from "../../../../components/ui/TitledGroup";
import EditableDataFieldsRenderer from "../../../../components/common/EditableDataFieldsRenderer";
import { useSelector } from "react-redux";

const ExceptionPreviewCard = ({ selectedId, onClose }) => {
  const [selected, setSelected] = useState(null);
  // const data = useMemo(() => selected, [selected]);
  const [formSpy, setFormSpy] = useState(false);
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  const [quickFilter, setQuickFilter] = useState(null);
  const cardTitle = `Loan Exception #${selectedId}`;

  const exceptions = useMemo(
    () => loanDrilldown?.exceptions || [],
    [loanDrilldown]
  );

  useEffect(() => {
    if (isNil(selectedId)) return;
    const borrower = exceptions?.find(
      (b) => b._id === selectedId || b.id === selectedId
    );
    setSelected(borrower);
  }, [selectedId, exceptions]);
  if (isNil(selected) || isEmpty(selected)) return null;
  return (
    <TablePreviewCard
      title={cardTitle}
      onClose={onClose}
      formSpy={formSpy}
      setFormSpy={setFormSpy}
      quickFilter={quickFilter}
      setQuickFilter={setQuickFilter}
      searchPlaceholder="Search in exception"
    >
      <FieldsGroup data={selected} quickFilter={quickFilter} />
    </TablePreviewCard>
  );
};

const FieldsGroup = ({ data, formSpy, quickFilter }) => {
  // 1. Basic Info
  const exceptionBasicInfo = useMemo(() => {
    return [
      {
        cellValueSize: 8,
        name: "exceptionDate",
        label: "Exception Date",
        type: "date",
      },
      {
        cellValueSize: 8,
        name: "exceptionCategory",
        label: "Exception Category",
        type: "selectMultiple",
        options: [
          "Subject Property",
          "Borrower",
          "Leverage",
          "Pricing",
          "Other Guideline",
        ],
      },
      {
        cellValueSize: 8,
        name: "exceptionReference",
        label: "Exception Reference",
        type: "selectMultiple",
        options: [
          "Internal Guideline",
          "External Guideline",
          "Leverage & Pricing Grid",
        ],
      },
      {
        cellValueSize: 8,
        name: "exceptionGuideline",
        label: "Exception Guideline",
        type: "stringMultiline",
        description: "Summary or excerpt of the guideline being overridden.",
      },
      {
        cellValueSize: 8,
        name: "compensatingFactors",
        label: "Compensating Factors",
        type: "stringMultiline",
        description: "Factors that help mitigate or support the exception.",
      },
      {
        cellValueSize: 8,
        name: "pricingConcession",
        label: "Pricing Concession",
        type: "stringMultiline",
        description: "If a pricing concession was agreed upon, detail it here.",
      },
    ];
  }, []);

  // 2. Approval & Counterparty
  const exceptionApprovalAndCounterparty = useMemo(() => {
    return [
      {
        cellValueSize: 8,
        name: "exceptionApprovalBy",
        label: "Exception Approval By",
        type: "email",
        description:
          "Email of the user who officially approved the exception (should always be populated).",
      },
      {
        cellValueSize: 8,
        name: "exceptionApprovalNote",
        label: "Exception Approval Note",
        type: "stringMultiline",
        description:
          "Details about the approval. If an internal source stated who approved, note it here.",
      },
      {
        cellValueSize: 8,
        name: "exceptionApprovalByCounterparty",
        label: "Approval By Counterparty",
        type: "booleanCheckbox",
        description:
          "Whether the external counterparty also confirmed approval.",
      },
      {
        cellValueSize: 8,
        name: "counterparty",
        label: "Counterparty",
        required: true,
        type: "text",
        description:
          "If the loan is to be sold or transferred, the name of the counterparty.",
      },
    ];
  }, []);

  return (
    <RffLoanDataGroup formSpy={formSpy} initialValues={data}>
      <>
        <Grid2 container spacing={8}>
          <Grid2 size={6}>
            <TitledEditableFieldsRenderer
              title="Exception Details"
              quickFilter={quickFilter}
              data={data}
              fields={exceptionBasicInfo}
            />
          </Grid2>
          <Grid2 size={6}>
            <TitledEditableFieldsRenderer
              title="Approval And Counterparty"
              quickFilter={quickFilter}
              data={data}
              fields={exceptionApprovalAndCounterparty}
            />
          </Grid2>
        </Grid2>
      </>
    </RffLoanDataGroup>
  );
};

const TitledFieldsGroup = ({ fields, quickFilter, title }) => {
  return (
    <TitledGroup title={title}>
      <EditableDataFieldsRenderer quickFilter={quickFilter} fields={fields} />
    </TitledGroup>
  );
};
export default React.memo(ExceptionPreviewCard);
