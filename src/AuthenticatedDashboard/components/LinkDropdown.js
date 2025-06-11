import {
  Collapse,
  List,
  ListItem,
  ListItemButton,
  useTheme,
} from "@mui/material";
import React from "react";
import { getItemStyles } from "../utils/getItemStyles";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { grey } from "@mui/material/colors";

// --------------------------------
// Dropdown link component
// --------------------------------
const LinkDropdown = ({ label, icon, children, collapsed }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton
          onClick={handleClick}
          sx={{
            ...getItemStyles({
              theme,
              // isActive: open, // treat "open" as "active"
              collapsed,
            }),
          }}
        >
          {icon}
          {!collapsed && label}
          {!collapsed && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{ ml: 1.8, pl: 1, borderLeft: `1px solid ${grey[300]}` }}
        >
          {children}
        </List>
      </Collapse>
    </>
  );
};

export default LinkDropdown;
