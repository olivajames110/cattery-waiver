import React from "react";
import { useFormState } from "react-final-form";
import RffFieldComponentRenderer from "./RffFieldComponentRenderer";
import { rffEvaluateFieldCondition } from "../utils/rffEvaluateFieldCondition";
import { isNil } from "lodash";

const RffFieldsRenderer = ({ fields }) => {
  const { values } = useFormState();

  return fields?.map((field) => {
    // Check conditions, including nested ones
    if (isNil(field?.field)) {
      return null;
    }
    if (!rffEvaluateFieldCondition(field.condition, values)) return null;

    return <RffFieldComponentRenderer key={field.field} field={field} />;
  });
};

export default RffFieldsRenderer;
