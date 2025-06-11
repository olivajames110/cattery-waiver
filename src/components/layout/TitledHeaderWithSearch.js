import { Box } from "@mui/material";
import React from "react";
import ScreenContent from "./ScreenContent";
import Flx from "./Flx";
import Htag from "../typography/Htag";
import SearchInputLight from "../inputs/SearchInputLight";

const TitledHeaderWithSearch = ({
  title,
  children,
  variant = "h2",
  quickFilter,
  setQuickFilter,
  endContent,
  searchPlaceholder,
  sx,
}) => {
  return (
    <>
      <ScreenContent
        sx={{
          display: "flex",
          background: "#ffffff",
          flexDirection: "column",
          borderBottom: "1px solid #e0e0e0",
          ...sx,
        }}
      >
        <Flx fw jb ac>
          <Flx column gap={1}>
            {title ? <Htag variant={variant}>{title}</Htag> : null}

            <SearchInputLight
              value={quickFilter}
              onChange={setQuickFilter}
              placeholder={searchPlaceholder}
              sx={{ input: { padding: 0 } }}
            />
          </Flx>
          {endContent}
        </Flx>
      </ScreenContent>
      <Box>{children}</Box>
    </>
  );
};

export default TitledHeaderWithSearch;
