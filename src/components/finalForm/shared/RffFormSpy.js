import { Card } from "@mui/material";
import React from "react";
import { FormSpy } from "react-final-form";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";

const RffFormSpy = ({ formSpy }) => {
  if (!formSpy) {
    return null;
  }
  return (
    <FormSpy subscription={{ values: true }}>
      {({ values }) => (
        <Card
          sx={{
            marginTop: "14px",
            ".json-view": {
              div: {
                margin: "3px 0",
              },
            },
          }}
        >
          <div style={{ marginBottom: "18px" }}>Form Spy</div>
          <JsonView src={values} theme="atom" enableClipboard displaySize />
        </Card>
      )}
    </FormSpy>
  );
  // return <FormSpy subscription={{ values: true }}>{({ values }) => <FormResults values={values} />}</FormSpy>;
};
export default RffFormSpy;
