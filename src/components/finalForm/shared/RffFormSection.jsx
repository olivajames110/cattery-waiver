import React from "react";
import { Grid } from "@mui/material";

import Flx from "../../layout/Flx";
import Htag from "../../typography/Htag";

/**
 * RffFormSection
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Content of the form section
 * @param {string} [props.title] - Section title (optional)
 * @param {string} [props.titleType='h4'] - Heading type for the title (e.g. 'h1', 'h2', 'h3', 'h4') if Htag supports it
 * @param {boolean} [props.disableGrid=false] - If true, content won't be rendered in a MUI Grid container
 * @param {boolean} [props.isGridChild=false] - If true, wraps the section in a <Grid item xs={12}/> so it can be placed within a Grid container
 * @param {number} [props.columnSpacing=2] - The spacing between columns in the Grid
 * @param {number} [props.rowSpacing=3.2] - The spacing between rows in the Grid
 * @param {object} [props.sx] - Optional style overrides (MUI sx prop)
 */
const RffFormSection = ({
  children,
  title,
  titleType = "h2",
  disableGrid = false,
  isGridChild = false,
  columnSpacing = 2.4,
  rowSpacing = 4,
  // columnSpacing = 2,
  // rowSpacing = 3.2,
  sx,
}) => {
  const content = (
    <ContentWrapper
      title={title}
      titleType={titleType}
      disableGrid={disableGrid}
      columnSpacing={columnSpacing}
      rowSpacing={rowSpacing}
      sx={sx}
    >
      {children}
    </ContentWrapper>
  );

  // If this section is part of a larger Grid, wrap it in <Grid item xs={12}/>
  if (isGridChild) {
    return (
      <Grid item xs={12}>
        {content}
      </Grid>
    );
  }

  // Otherwise, just render the content directly
  return content;
};

const ContentWrapper = ({
  title,
  titleType,
  disableGrid,
  columnSpacing,
  rowSpacing,
  sx,
  children,
}) => {
  return (
    <Flx column grow fw>
      {title && (
        <Htag {...{ [titleType]: true }} sx={{ margin: "16px 0 24px" }}>
          {/* <Htag {...{ [titleType]: true }} sx={{ margin: "8px 0 14px" }}> */}
          {title}
        </Htag>
      )}
      <SectionContent
        disableGrid={disableGrid}
        columnSpacing={columnSpacing}
        rowSpacing={rowSpacing}
        sx={sx}
      >
        {children}
      </SectionContent>
    </Flx>
  );
};

const SectionContent = ({
  disableGrid,
  columnSpacing,
  rowSpacing,
  sx,
  children,
}) => {
  if (disableGrid) {
    return (
      <Flx column fw sx={{ gap: "36px", ...sx }}>
        {children}
      </Flx>
    );
  }

  return (
    <Grid
      container
      columnSpacing={columnSpacing}
      rowSpacing={rowSpacing}
      sx={sx}
    >
      {children}
    </Grid>
  );
};

export default RffFormSection;
