import {
  CloseRounded,
  FullscreenRounded,
  KeyboardArrowDownRounded,
  MinimizeRounded,
  PhotoSizeSelectSmallRounded,
} from "@mui/icons-material";
import { Button, Dialog, IconButton, Slide, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useMemo, useState } from "react";

import Flx from "../layout/Flx";
import Htag from "../typography/Htag";
import ModalContent from "./shared/ModalContent";

const displayModes = {
  FULL: "full",
  DOCKED: "docked",
  MINIMIZED: "minimized",
};

const DockedModalOld = ({
  show,
  onClose,
  title,
  children,
  sx,
  defaultDisplayMode = displayModes.FULL,
  suppressBodyPadding,
  suppressBodyOverflow,
  bodySx,
  fullWidth,
  paperSx,
  maxHeight = "880px",
  maxWidth = "lg",
  headerSx,
}) => {
  const [displayMode, setDisplayMode] = useState(defaultDisplayMode);

  const handleClose = () => {
    setDisplayMode(defaultDisplayMode);
    onClose(false);
  };

  const toggleMinimize = () => {
    setDisplayMode(
      displayMode === displayModes.MINIMIZED
        ? defaultDisplayMode
        : displayModes.MINIMIZED
    );
  };

  const dialogStyles = useMemo(() => {
    const baseStyles = { ...sx };

    if (displayMode === displayModes.DOCKED) {
      baseStyles[".MuiDialog-container"] = {
        justifyContent: "flex-end",
        alignItems: "flex-end",
        ".MuiPaper-root.MuiDialog-paper": {
          boxShadow: "0 12px 28px 0 #0000001a, 0 2px 4px 0 #0000001a",
          border: "1px solid rgba(0, 0, 0, .1)",
          maxWidth: "420px",
          width: "100%",
          maxHeight: maxHeight,
          height: "auto",
          position: "fixed",
          bottom: 0,
          right: 80,
          left: "auto",
          margin: 0,
          borderRadius: "12px 12px 0 0",
          background: "white",
          display: "flex",
          flexDirection: "column",
        },
      };
    }

    return baseStyles;
  }, [displayMode, maxHeight, sx]);

  if (displayMode === displayModes.MINIMIZED) {
    return (
      <Button
        size="large"
        endIcon={<KeyboardArrowDownRounded />}
        onClick={toggleMinimize}
        color="primary"
        sx={{
          position: "fixed",
          bottom: 14,
          right: 30,
          borderRadius: "80px !important",
          zIndex: 1111,
        }}
      >
        {title} (Minimized)
      </Button>
    );
  }

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      fullScreen={fullWidth}
      maxWidth={maxWidth}
      hideBackdrop={displayMode === displayModes.DOCKED}
      TransitionComponent={Transition}
      sx={dialogStyles}
    >
      <Header
        title={title}
        onClose={handleClose}
        displayMode={displayMode}
        onDisplayModeChange={setDisplayMode}
      />
      <Body
        suppressBodyPadding={suppressBodyPadding}
        suppressBodyOverflow={suppressBodyOverflow}
        sx={bodySx}
      >
        {children}
      </Body>
    </Dialog>
  );
};

const Header = ({ title, onClose, displayMode, onDisplayModeChange }) => {
  return (
    <ModalContent
      sx={{
        position: "relative",
        overflow: "hidden",
        boxShadow:
          "0 1px 2px rgba(0, 0, 0, .1), 0 -1px rgba(0, 0, 0, .1) inset",
      }}
    >
      <Flx fw jb ac>
        <Htag sx={{ lineHeight: 1.4 }} h2>
          {title}
        </Htag>

        <Flx ac g={0}>
          <ModalHeaderButton
            tooltip="Minimize"
            active={displayMode === displayModes.MINIMIZED}
            onClick={() => onDisplayModeChange(displayModes.MINIMIZED)}
            icon={<MinimizeRounded sx={{ fontSize: "15px !important" }} />}
          />

          <ModalHeaderButton
            tooltip="Docked"
            active={displayMode === displayModes.DOCKED}
            onClick={() => onDisplayModeChange(displayModes.DOCKED)}
            icon={
              <PhotoSizeSelectSmallRounded
                sx={{ fontSize: "15px !important", transform: "scaleX(-1)" }}
              />
            }
          />

          <ModalHeaderButton
            tooltip="Full Screen"
            active={displayMode === displayModes.FULL}
            onClick={() => onDisplayModeChange(displayModes.FULL)}
            icon={<FullscreenRounded />}
          />

          <Tooltip title="Close" arrow>
            <IconButton
              color="primary"
              size="small"
              sx={{ marginLeft: 1, borderRadius: "4px" }}
              onClick={onClose}
            >
              <CloseRounded />
            </IconButton>
          </Tooltip>
        </Flx>
      </Flx>
    </ModalContent>
  );
};

const ModalHeaderButton = ({ onClick, tooltip, active, icon }) => (
  <Tooltip title={tooltip} arrow>
    <IconButton
      size="small"
      sx={{
        background: active ? grey[200] : "none",
        borderRadius: "4px",
        width: "31px",
        height: "31px",
      }}
      onClick={onClick}
    >
      {icon}
    </IconButton>
  </Tooltip>
);

const Body = ({ children, suppressBodyPadding, suppressBodyOverflow, sx }) => {
  const styles = useMemo(
    () => ({
      position: "relative",
      padding: suppressBodyPadding ? 0 : undefined,
      overflow: suppressBodyOverflow ? "hidden" : undefined,
      ...sx,
    }),
    [suppressBodyPadding, suppressBodyOverflow, sx]
  );

  return <ModalContent sx={styles}>{children}</ModalContent>;
};

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default DockedModalOld;
