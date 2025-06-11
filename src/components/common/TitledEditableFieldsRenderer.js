import React from "react";
import TitledGroup from "../ui/TitledGroup";
import EditableDataFieldsRenderer from "./EditableDataFieldsRenderer";
import { Grid2 } from "@mui/material";

const TitledEditableFieldsRenderer = ({
  fields,
  quickFilter,
  title,
  icon,
  size,
  data,
  uppercase,
  fontWeight,
  onUpdateFn,
}) => {
  if (size) {
    return (
      <Grid2 size={size}>
        <TitledGroup
          title={title}
          uppercase={uppercase}
          fontWeight={fontWeight}
          icon={icon}
        >
          <EditableDataFieldsRenderer
            quickFilter={quickFilter}
            fields={fields}
            data={data}
            onUpdateFn={onUpdateFn}
          />
        </TitledGroup>
      </Grid2>
    );
  }
  return (
    <TitledGroup
      title={title}
      uppercase={uppercase}
      fontWeight={fontWeight}
      icon={icon}
    >
      <EditableDataFieldsRenderer
        quickFilter={quickFilter}
        fields={fields}
        data={data}
        onUpdateFn={onUpdateFn}
      />
    </TitledGroup>
  );
};
export default TitledEditableFieldsRenderer;
