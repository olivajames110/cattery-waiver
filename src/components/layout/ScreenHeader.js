import { Box, Typography, useTheme } from "@mui/material";
import React, { useMemo } from "react";
import Htag from "../typography/Htag";
import Flx from "./Flx";
import { grey } from "@mui/material/colors";

const ScreenHeader = ({
  children,
  title,
  description,
  descriptionContent,
  endContent,

  suppressBottomBorder,
  suppressBottomPadding,
  titleTopContent,
  titleBottomContent,
  titleEndContent,
  sx,
  fw,
}) => {
  const styles = useMemo(() => {
    return {
      inner: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 1,
      },
      ...sx,
    };
  }, [sx]);
  return (
    <DashboardScreenAppBar
      suppressBottomPadding={suppressBottomPadding}
      suppressBottomBorder={suppressBottomBorder}
    >
      <Box className="header-inner-wrapper" sx={styles.inner}>
        <TitleRenderer
          endContent={endContent}
          title={title}
          description={description}
          descriptionContent={descriptionContent}
          titleEndContent={titleEndContent}
          titleTopContent={titleTopContent}
          titleBottomContent={titleBottomContent}
        />
        {endContent}
      </Box>
      {children}
    </DashboardScreenAppBar>
  );
};

const TitleRenderer = ({
  title,
  description,
  descriptionContent,
  titleTopContent,
  titleBottomContent,
  titleEndContent,
}) => {
  return (
    <>
      <Flx column g={1} sx={{ flexGrow: 1 }}>
        {titleTopContent}

        {titleEndContent ? (
          <Flx ac wrap>
            <Htag
              h1
              sx={{ color: "var(--titleColor)", fontSize: "24px" }}
              weight="bold"
              size={300}
            >
              {title}
            </Htag>
            {titleEndContent}
          </Flx>
        ) : (
          <Htag
            h1
            sx={{ color: "var(--titleColor)", fontSize: "24px" }}
            weight="bold"
            size={300}
          >
            {title}
          </Htag>
        )}
        {titleBottomContent}
        {description ? (
          <Typography size={200} variant="body1" sx={{ paddingLeft: "1px" }}>
            {description}
          </Typography>
        ) : null}
        {descriptionContent ? descriptionContent : null}
      </Flx>
    </>
  );
};

const DashboardScreenAppBar = ({
  children,
  suppressBottomBorder,
  suppressTopPadding,
  suppressBottomPadding,
  sx,
  fw,
}) => {
  const theme = useTheme();
  const defaultPaddingConst = 2;
  const styles = useMemo(() => {
    return {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
      // boxShadow:
      //   theme.palette.mode === "dark"
      //     ? "rgba(255, 255, 255, 0.32) 0px 0px 1px, rgba(255, 255, 255, 0.08) 0px 0px 2px, rgba(255, 255, 255, 0.08) 0px 1px 3px"
      //     : "rgba(0, 0, 0, 0.32) 0px 0px 1px, rgba(0, 0, 0, 0.08) 0px 0px 2px, rgba(0, 0, 0, 0.08) 0px 1px 3px", // Adjust box shadow for light/
      // flexGrow: 1,
      // borderBottom: suppressBottomBorder ? null : `1px solid ${grey[200]}`,
      pt: suppressTopPadding ? 0 : defaultPaddingConst,
      pr: fw ? 0 : defaultPaddingConst,
      pb: suppressBottomPadding ? 0 : defaultPaddingConst,
      pl: fw ? 0 : defaultPaddingConst,
      position: "relative",
      ...sx,
    };
  }, [sx, fw, suppressTopPadding, suppressBottomPadding, suppressBottomBorder]);
  return (
    <Box component="header" sx={styles}>
      {children}
    </Box>
  );
};

export default ScreenHeader;
