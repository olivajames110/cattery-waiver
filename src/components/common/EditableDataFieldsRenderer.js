import React, { useEffect, useMemo, useState } from "react";
import Txt from "../typography/Txt";
import EditableDataRow from "./EditableDataRow";

const EditableDataFieldsRenderer = ({
  quickFilter,
  fields,
  onUpdateFn,
  data,
}) => {
  const filteredFields = useMemo(() => {
    // If quickFilter is empty or just whitespace, return all fields
    if (!quickFilter?.trim()) {
      return fields;
    }

    const lowerFilter = quickFilter.toLowerCase();
    return fields.filter(
      (field) =>
        field?.name?.toLowerCase()?.includes(lowerFilter) ||
        field?.label?.toLowerCase()?.includes(lowerFilter)
    );
  }, [quickFilter, fields]);

  // If there are no fields matching the filter, you can return null or
  // a small message like "No fields found."

  if (!filteredFields.length) {
    return <Txt sx={{ opacity: 0.45 }}>No fields found</Txt>;
  }

  return filteredFields.map((f) => (
    <EditableDataRow
      key={f.name}
      name={f.name}
      label={f.label}
      disabled={f?.disabled}
      type={f.type}
      grow={f.grow}
      cellValueSize={f.cellValueSize}
      options={f?.options}
      onUpdateFn={onUpdateFn}
      data={data}
      stacked={f?.stacked}
    />
  ));
};

export default EditableDataFieldsRenderer;
