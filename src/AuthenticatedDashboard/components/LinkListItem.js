import { ListItem, useTheme } from "@mui/material";
import React from "react";
import { NavLink } from "react-router-dom";
import { getItemStyles } from "../utils/getItemStyles";
import { isNil } from "lodash";

// --------------------------------
// Normal link item
// --------------------------------
const LinkListItem = ({ label, to, icon, onClick, collapsed }) => {
  const theme = useTheme();

  return (
    <ListItem disablePadding>
      <NavLink
        to={to}
        end
        style={(navData) =>
          getItemStyles({
            theme,
            isActive: isNil(to) ? false : navData?.isActive,
            collapsed,
          })
        }
        onClick={onClick}
      >
        {icon}
        {!collapsed && label}
      </NavLink>
    </ListItem>
  );
};

export default LinkListItem;
