import React from "react";
import { useFormState } from "react-final-form";

const RffStateWrapper = ({ children }) => {
  const { values } = useFormState();
  return children({ values });
};

export default RffStateWrapper;
