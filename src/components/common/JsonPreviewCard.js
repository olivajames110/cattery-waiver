import { Card } from "@mui/material";
import React, { useState } from "react";
import JsonView from "react18-json-view";
import SearchInput from "../inputs/SearchInput";
import JsonPreview from "./JsonPreview";

const JsonPreviewCard = ({ values }) => {
  const [search, setSearch] = useState(null);
  return (
    <Card
      sx={{
        ".json-view": {
          div: {
            margin: "3px 0",
          },
        },
      }}
    >
      <JsonPreview values={values} />
    </Card>
  );
};

export default JsonPreviewCard;
