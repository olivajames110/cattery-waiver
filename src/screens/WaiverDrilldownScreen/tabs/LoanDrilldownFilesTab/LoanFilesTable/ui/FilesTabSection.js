import React from "react";
import Flx from "../../../../../../components/layout/Flx";
import Htag from "../../../../../../components/typography/Htag";
import { Box } from "@mui/material";

const FilesTabSection = ({ title, children, endContent }) => {
  return (
    <Flx column sx={{ mt: 1, mb: 5 }}>
      {endContent ? (
        <Flx fw jb ac>
          <Htag h3>{title}</Htag>
          {endContent}
        </Flx>
      ) : (
        <Htag h3>{title}</Htag>
      )}

      <Box sx={{ mt: 1 }}>{children}</Box>
    </Flx>
  );
};

export default FilesTabSection;
