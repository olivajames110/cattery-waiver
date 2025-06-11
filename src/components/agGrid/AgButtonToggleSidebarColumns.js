// AgButtonToggleColumns.js
import { FilterAltOutlined, ViewColumnOutlined } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import React, { forwardRef } from "react";

const AgButtonToggleSidebarColumns = forwardRef(
  ({ onClick, icon, label = "Toggle Columns" }, ref) => {
    const handleOnClick = () => {
      // If there's a custom onClick, call it
      if (onClick) {
        onClick(ref);
      }

      // Use AG Grid's panel API to toggle the columns sidebar
      if (ref?.current?.api) {
        const currentlyOpened = ref.current.api.getOpenedToolPanel();
        if (currentlyOpened === "columns") {
          ref.current.api.closeToolPanel();
        } else {
          ref.current.api.openToolPanel("columns");
        }
      }
    };

    if (icon) {
      return (
        <Tooltip arrow title="Toggle Table Columns">
          <IconButton onClick={handleOnClick}>
            <ViewColumnOutlined />
          </IconButton>
        </Tooltip>
      );
    }

    return (
      <Button variant="text" onClick={handleOnClick}>
        {label}
      </Button>
    );
  }
);

export default AgButtonToggleSidebarColumns;
