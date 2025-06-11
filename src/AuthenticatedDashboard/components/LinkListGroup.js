import React from "react";
import Flx from "../../components/layout/Flx";
import { List, Typography } from "@mui/material";
import { grey } from "@mui/material/colors";
import { isNil } from "lodash";

// --------------------------------
// Group "section" title wrapper
// --------------------------------
const LinkListGroup = ({ title, children, collapsed }) => {
  return (
    <Flx
      column
      sx={{
        p: collapsed ? 0 : 2,
        paddingTop: collapsed || isNil(title) ? 0 : "24px",
        ".MuiSvgIcon-root": {
          fontSize: "16px",
        },
      }}
    >
      <GroupTitle collapsed={collapsed}>{title}</GroupTitle>
      <List sx={{ pb: 0 }}>{children}</List>
    </Flx>
  );
};

const GroupTitle = ({ children, collapsed }) => {
  if (collapsed || isNil(children)) {
    return null;
  }
  return (
    <Typography
      textTransform={"uppercase"}
      fontSize={"11px"}
      fontWeight={500}
      color={grey[600]}
    >
      {children}
    </Typography>
  );
};

export default LinkListGroup;
