import { Box, Container } from "@mui/material";
import React, { useMemo } from "react";

const ScreenContent = ({
  children,
  className,
  padding = 2,
  maxWidth,
  suppressPaddingBottom,
  suppressPaddingTop,
  suppressPaddingTopBottom,
  suppressPaddingLeftRight,
  suppressPadding,
  sx,
}) => {
  // const styles = useMemo(() => {
  //   return {
  //     inner: {
  //       display: "flex",
  //       justifyContent: "space-between",
  //       alignItems: "center",
  //     },
  //     ...sx,
  //   };
  // }, [sx]);

  const styles = useMemo(() => {
    let paddingStyles = {
      p: padding,
    };

    if (suppressPaddingTopBottom) {
      paddingStyles["pt"] = 0;
      paddingStyles["pb"] = 0;
    }

    if (suppressPaddingLeftRight) {
      paddingStyles["pl"] = 0;
      paddingStyles["pr"] = 0;
    }

    if (suppressPaddingBottom) {
      paddingStyles["pb"] = 0;
    }

    if (suppressPaddingTop) {
      paddingStyles["pt"] = 0;
    }

    if (suppressPadding) {
      paddingStyles["p"] = 0;
    }

    return {
      ...paddingStyles,
      ...sx,
    };
  }, [
    padding,
    suppressPaddingTopBottom,
    suppressPaddingLeftRight,
    suppressPaddingTop,
    suppressPaddingBottom,
    suppressPadding,
    sx,
  ]);

  if (maxWidth) {
    return (
      <Container className={className} maxWidth={maxWidth}>
        <Box sx={styles}>{children}</Box>
      </Container>
    );
  }
  return (
    <Box className={className} sx={styles}>
      {children}
    </Box>
  );
};

export default ScreenContent;
