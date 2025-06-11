import { FilterAlt, FilterAltOutlined } from "@mui/icons-material";
import { Button, IconButton, Tooltip } from "@mui/material";
import React, { forwardRef } from "react";

const AgButtonToggleSidebarFilters = forwardRef(
  ({ onClick, label = "Toggle Filters", icon }, ref) => {
    const handleOnClick = () => {
      // If there's a custom onClick, call it
      if (onClick) {
        onClick(ref);
      }

      // Use AG Grid's panel API to toggle the filters sidebar
      if (ref?.current?.api) {
        const currentlyOpened = ref.current.api.getOpenedToolPanel();
        if (currentlyOpened === "filters") {
          ref.current.api.closeToolPanel();
        } else {
          ref.current.api.openToolPanel("filters");
        }
      }
    };

    if (icon) {
      return (
        <Tooltip title="Toggle Table filters">
          <IconButton onClick={handleOnClick}>
            <FilterAltOutlined />
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

export default AgButtonToggleSidebarFilters;
