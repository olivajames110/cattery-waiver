import React from "react";

import { grey } from "@mui/material/colors";
import Flx from "../../components/layout/Flx";

const TextOverflow = ({ children, maxHeight = "280px" }) => {
  return (
    <Flx
      column
      gap={2}
      sx={{
        maxHeight: maxHeight,
        overflowY: "auto",
        p: 2,
        background: "#fff",
        border: `1px solid ${grey[300]}`,
        borderRadius: "4px",
      }}
    >
      {children}
    </Flx>
  );
};

export default TextOverflow;
