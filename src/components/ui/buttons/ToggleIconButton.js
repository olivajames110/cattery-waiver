import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import React from "react";

const ToggleIconButton = ({ children, active, onClick }) => {
  return (
    <IconButton
      color={active ? "primary" : "default"}
      onClick={() => onClick((s) => !s)}
    >
      {children ? (
        children
      ) : active ? (
        <KeyboardArrowUp />
      ) : (
        <KeyboardArrowDown />
      )}
    </IconButton>
  );
};

export default ToggleIconButton;
