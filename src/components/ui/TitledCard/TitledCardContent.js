import { Box } from "@mui/material";
import { isNil } from "lodash";
import React, { useMemo } from "react";

const TitledCardContent = ({
  children,
  sx,
  suppressPaddingBottom,
  suppressPaddingTop,
  suppressPaddingTopBottom,
  suppressPaddingLeftRight,
  suppressPadding,
}) => {
  const styles = useMemo(() => {
    let paddingStyles = {
      p: 2,
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
    sx,
    suppressPaddingTopBottom,
    suppressPaddingLeftRight,
    suppressPaddingTop,
    suppressPaddingBottom,
    suppressPadding,
  ]);
  if (isNil(children)) return null;
  return <Box sx={styles}>{children}</Box>;
};
export default TitledCardContent;
