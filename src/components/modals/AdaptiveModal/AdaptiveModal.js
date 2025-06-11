import {
  CloseRounded,
  FullscreenRounded,
  KeyboardArrowDownRounded,
  MinimizeRounded,
  PhotoSizeSelectSmallRounded,
} from "@mui/icons-material";
import { Button, Dialog, IconButton, Slide, Tooltip } from "@mui/material";
import { grey } from "@mui/material/colors";
import { isBoolean, isNil, isString } from "lodash";
import React, { useMemo, useState } from "react";
import AdaptiveModelContent from "./AdaptiveModelContent";
import Flx from "../../layout/Flx";
import Htag from "../../typography/Htag";

const shadow1 = "rgba(0, 0, 0, .1)";
const mediaInnerBorder = "rgba(0, 0, 0, .1)";
const shadowInset = "rgba(255, 255, 255, .5)";

const displayModeOptions = {
  full: "full",
  compact: "compact",
  bubble: "bubble",
};

const determineFullWidth = (mode) => {
  if (mode === displayModeOptions.full) {
    return true;
  }
  return false;
};

const AdaptiveModal = ({
  show,
  onClose,
  title,
  children,
  sx,
  defaultDisplayMode,
  suppressBodyPadding,
  suppressBodyOverflow,
  bodySx,
  fullWidth,
  paperSx,
  placementRight,
  fullHeight,
  maxWidth = "lg",
  headerSx,
}) => {
  const handleClose = () => {
    onClose(false);
    setDisplayMode(defaultDisplayMode);
  };

  const [displayMode, setDisplayMode] = useState(defaultDisplayMode);

  const dialogStyles = useMemo(() => {
    const sty = {};

    if (displayMode === displayModeOptions.bubble) {
      sty.height = 0;
      sty.width = 0;
    }

    if (displayMode === displayModeOptions.compact) {
      sty.top = "auto";
      sty.left = "auto";
      sty.bottom = 0;
      sty.right = 78;
      sty[".MuiDialog-container"] = {
        ".MuiPaper-root.MuiDialog-paper": {
          boxShadow: "0 12px 28px 0 #0000001a, 0 2px 4px 0 #0000001a",
          margin: 0,
          border: `1px solid ${mediaInnerBorder}`,
          maxWidth: "420px",
          maxHeight: "calc(60vh - 64px)",
        },
      };
    }

    if (isNil(displayMode)) {
      if (placementRight) {
        sty[".MuiDialog-container"] = {
          justifyContent: "flex-end",
          ".MuiPaper-root.MuiDialog-paper": {
            margin: "16px",
          },
        };
      }

      if (fullHeight) {
        sty[".MuiDialog-container"] = {
          ...sty[".MuiDialog-container"],
          justifyContent: "flex-end",
          ".MuiPaper-root.MuiDialog-paper": {
            ...(sty[".MuiDialog-container"]?.[
              ".MuiPaper-root.MuiDialog-paper"
            ] || {}),
            height: "100%",
          },
        };
      }
    }

    if (paperSx) {
      // Merge with any existing .MuiPaper-root.MuiDialog-paper styles if present
      const containerStyles = sty[".MuiDialog-container"] || {};
      containerStyles[".MuiPaper-root.MuiDialog-paper"] = {
        ...(containerStyles[".MuiPaper-root.MuiDialog-paper"] || {}),
        ...paperSx,
      };
      sty[".MuiDialog-container"] = containerStyles;
    }

    // Finally merge with sx
    return {
      ...sty,
      ...sx,
    };
  }, [sx, displayMode, placementRight, fullHeight, paperSx]);

  const _fullScreen = useMemo(() => {
    if (isBoolean(fullWidth)) {
      return fullWidth;
    }
    return determineFullWidth(displayMode);
  }, [displayMode, fullWidth]);

  const _hideBackdrop = useMemo(() => {
    if (
      displayMode === displayModeOptions.bubble ||
      displayMode === displayModeOptions.compact
    ) {
      return true;
    }
    return false;
  }, [displayMode]);

  const _maxWidth = useMemo(() => {
    if (isString(maxWidth)) {
      return maxWidth;
    }
    return false;
  }, [maxWidth]);

  const onDisplayModeChange = (mode) => {
    console.log("Mode", mode);
    if (displayMode === mode) {
      setDisplayMode(null);
      return;
    }
    setDisplayMode(mode);
    // setFullScreen(determineFullWidth(mode));
  };
  return (
    <>
      {displayMode === displayModeOptions.bubble ? (
        <Button
          size="large"
          endIcon={<KeyboardArrowDownRounded />}
          onClick={() => setDisplayMode(defaultDisplayMode)}
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
      ) : null}
      <Dialog
        open={show}
        onClose={handleClose}
        fullScreen={_fullScreen}
        maxWidth={_maxWidth}
        hideBackdrop={_hideBackdrop}
        TransitionComponent={Transition}
        sx={dialogStyles}
      >
        <Header
          sx={headerSx}
          title={title}
          onClose={handleClose}
          displayMode={displayMode}
          onDisplayModeChange={onDisplayModeChange}
        />
        <Body
          suppressBodyPadding={suppressBodyPadding}
          suppressBodyOverflow={suppressBodyOverflow}
          sx={bodySx}
        >
          {children}
        </Body>
      </Dialog>
    </>
  );
};

const Header = ({ title, onClose, sx, displayMode, onDisplayModeChange }) => {
  const styles = useMemo(() => {
    let sty = {
      position: "relative",
      overflow: "hidden",
      flexGrow: 0,
      flexShrink: 0,
      boxShadow: `0 1px 2px ${shadow1},0 -1px ${mediaInnerBorder} inset,0 2px 1px -1px ${shadowInset} inset`,
    };

    return {
      ...sty,
      ...sx,
    };
  }, [sx]);
  return (
    <>
      <AdaptiveModelContent sx={styles}>
        <Flx fw jb ac>
          <Htag sx={{ lineHeight: 1.4 }} h2>
            {title}
          </Htag>

          <Flx ac g={0}>
            <ModalHeaderButton
              tooltip="Fully Minimized"
              active={displayMode === displayModeOptions.bubble}
              onClick={() => onDisplayModeChange(displayModeOptions.bubble)}
              icon={<MinimizeRounded sx={{ fontSize: "15px !important" }} />}
            />

            <ModalHeaderButton
              tooltip="Compact"
              active={displayMode === displayModeOptions.compact}
              onClick={() => onDisplayModeChange(displayModeOptions.compact)}
              icon={
                <PhotoSizeSelectSmallRounded
                  sx={{ fontSize: "15px !important", transform: "scaleX(-1)" }}
                />
              }
            />

            <ModalHeaderButton
              tooltip="Full Screen"
              active={displayMode === displayModeOptions.full}
              onClick={() => onDisplayModeChange(displayModeOptions.full)}
              icon={<FullscreenRounded />}
            />

            <Tooltip title={"Close"} arrow>
              <IconButton
                color="primary"
                size="small"
                sx={{ marginLeft: 1, borderRadius: "4px" }}
                onClick={() => onClose(false)}
              >
                <CloseRounded />
              </IconButton>
            </Tooltip>
          </Flx>
        </Flx>
      </AdaptiveModelContent>
    </>
  );
};

const ModalHeaderButton = ({ onClick, tooltip, active, children, icon }) => {
  return (
    <Tooltip title={tooltip} arrow>
      <IconButton
        size="small"
        sx={{
          background: active ? grey[200] : "none",
          borderRadius: "4px",
          width: "31px",
          height: "31px",
        }}
        onClick={() => (active ? onClick(null) : onClick())}
      >
        {icon}
      </IconButton>
    </Tooltip>
  );
};

const Body = ({ children, suppressBodyPadding, suppressBodyOverflow, sx }) => {
  const styles = useMemo(() => {
    let sty = { position: "relative" };

    if (suppressBodyPadding) {
      sty = { ...sty, padding: 0 };
    }
    if (suppressBodyOverflow) {
      sty = { ...sty, overflow: "hidden" };
    }
    return {
      ...sty,
      ...sx,
    };
  }, [sx]);
  return (
    <>
      <AdaptiveModelContent sx={styles}>{children}</AdaptiveModelContent>
    </>
  );
};

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default AdaptiveModal;
