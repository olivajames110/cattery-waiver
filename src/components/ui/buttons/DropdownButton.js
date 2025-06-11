import {
  KeyboardArrowDownRounded,
  KeyboardArrowUpRounded,
} from "@mui/icons-material";
import {
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { isFunction } from "lodash";
import React from "react";

const DropdownButton = ({
  options,
  children,
  startIcon,
  color,
  variant = "contained",
  id = "dropdown-button",
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (fn) => {
    console.log("fn", fn);
    if (isFunction(fn)) {
      fn();
    }
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id={id}
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant={variant}
        color={color}
        disableElevation
        startIcon={startIcon}
        onClick={handleClick}
        endIcon={
          open ? <KeyboardArrowUpRounded /> : <KeyboardArrowDownRounded />
        }
      >
        {children}
      </Button>
      <Menu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": id,
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {options?.map((o, i) => {
          return (
            <MenuItem
              key={i}
              onClick={() => handleClose(o?.onClick)}
              disableRipple
              sx={{
                ".MuiListItemIcon-root ": {
                  minWidth: "36px",
                  // minWidth: "24px",
                  ".MuiSvgIcon-root": {
                    fontSize: "16px",
                  },
                },
              }}
            >
              {o?.icon || o?.startIcon ? (
                <ListItemIcon>{o?.icon || o?.startIcon}</ListItemIcon>
              ) : null}

              <ListItemText sx={{ span: { fontSize: "12px" } }}>
                {o?.label}
              </ListItemText>
              {o?.endIcon ? <ListItemIcon>{o?.endIcon}</ListItemIcon> : null}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default DropdownButton;
