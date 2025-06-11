import {
  CloseRounded,
  ExpandLessRounded,
  ExpandMoreRounded,
  FullscreenRounded,
  KeyboardArrowDownRounded,
  MinimizeRounded,
  PhotoSizeSelectSmallRounded,
  VerticalAlignBottomRounded,
} from "@mui/icons-material";
import { Box, Button, Dialog, IconButton, Slide, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { useMemo, useState } from "react";

import Flx from "../layout/Flx";
import Htag from "../typography/Htag";
import ModalContent from "./shared/ModalContent";

const DockedModal = ({
  show,
  onClose,
  title,
  children,
  sx,

  suppressBodyPadding,
  suppressBodyOverflow,
  bodySx,
  fullWidth,
  paperSx,
  maxHeight = "1880px",
  maxWidth = "420px",
  collapsedMaxWidth = "360px",
  headerSx,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const _maxWidth = useMemo(() => {
    if (collapsed) {
      return collapsedMaxWidth;
    }
    return maxWidth;
  }, [collapsed, maxWidth, collapsedMaxWidth]);

  const handleClose = () => {
    setCollapsed(false);
    onClose(false);
  };

  const dialogStyles = useMemo(() => {
    const baseStyles = { ...sx };
    // Override the root dialog styles to allow interaction with background elements
    baseStyles["&.MuiDialog-root"] = {
      position: "absolute", // Change from fixed to absolute
      zIndex: 1300,
      pointerEvents: "none", // This allows clicking through to elements behind
      left: "auto", // Remove full-width positioning
      top: "auto", // Remove full-height positioning
      right: 80,
      bottom: 0,
    };
    baseStyles[".MuiDialog-container"] = {
      pointerEvents: "none", // This allows clicking through to elements behind
      justifyContent: "flex-end",
      alignItems: "flex-end",
      ".MuiPaper-root.MuiDialog-paper": {
        pointerEvents: "auto", // Ensure the modal itself is still interactive
        boxShadow: "0 12px 28px 0 #0000001a, 0 2px 4px 0 #0000001a",
        border: "1px solid rgba(0, 0, 0, .1)",
        maxWidth: _maxWidth,
        width: "100%",
        maxHeight: "80vh",
        // maxHeight: maxHeight,
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

    return baseStyles;
  }, [sx, _maxWidth]);

  return (
    <Dialog
      open={show}
      onClose={handleClose}
      fullScreen={fullWidth}
      maxWidth={_maxWidth}
      hideBackdrop={true}
      // TransitionComponent={Transition}
      sx={dialogStyles}
    >
      <Header
        title={title}
        onClose={handleClose}
        collapsed={collapsed}
        onCollapse={() => setCollapsed((s) => !s)}
      />
      <Body
        collapsed={collapsed}
        suppressBodyPadding={suppressBodyPadding}
        suppressBodyOverflow={suppressBodyOverflow}
        sx={bodySx}
      >
        {children}
      </Body>
    </Dialog>
  );
};

const Header = ({ title, onClose, onCollapse, collapsed }) => {
  return (
    <Box
      sx={{
        pt: 0,
        pb: 0,
        pl: 2,
        pr: 2,
        position: "relative",
        overflow: "hidden",
        minHeight: "64px",
        display: "flex",
        // boxShadow:
        //   "0 1px 2px rgba(0, 0, 0, .1), 0 -1px rgba(0, 0, 0, .1) inset",
      }}
    >
      <Flx fw jb ac sx={{}}>
        <Htag sx={{ lineHeight: 1.4, fontSize: "16px" }} h2>
          {title}
        </Htag>
        <Flx ac g={0}>
          {collapsed ? (
            <IconButton
              color="primary"
              size="small"
              sx={{ borderRadius: "4px" }}
              onClick={onCollapse}
            >
              <ExpandLessRounded />
            </IconButton>
          ) : (
            <Tooltip title="Minimize" arrow>
              <IconButton
                color="primary"
                size="small"
                sx={{ borderRadius: "4px" }}
                onClick={onCollapse}
              >
                <ExpandMoreRounded />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title="Close" arrow>
            <IconButton
              color="primary"
              size="small"
              sx={{ borderRadius: "4px" }}
              onClick={onClose}
            >
              <CloseRounded />
            </IconButton>
          </Tooltip>
        </Flx>
      </Flx>
    </Box>
  );
};

const Body = ({
  children,
  collapsed,
  suppressBodyPadding,
  suppressBodyOverflow,
  sx,
}) => {
  const styles = useMemo(
    () => ({
      position: "relative",
      display: "flex",
      flexDirection: "column",
      padding: suppressBodyPadding ? 0 : undefined,
      overflow: collapsed || suppressBodyOverflow ? "hidden" : undefined,
      height: collapsed ? 0 : "auto",
      transition: "1s",
      ...sx,
    }),
    [suppressBodyPadding, suppressBodyOverflow, collapsed, sx]
  );

  return <ModalContent sx={styles}>{children}</ModalContent>;
};

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

export default DockedModal;
