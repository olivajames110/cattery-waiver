import {
  CloseRounded,
  FullscreenExitRounded,
  FullscreenRounded,
} from "@mui/icons-material";
import { Dialog, IconButton, Tooltip } from "@mui/material";
import { useCallback, useMemo, useState } from "react";

import { blue } from "@mui/material/colors";
import Flx from "../layout/Flx";
import Htag from "../typography/Htag";
import ModalContent from "./shared/ModalContent";

const BasicModal = ({
  show,
  onClose,
  title,
  children,
  sx,
  suppressBodyPadding,
  suppressBodyOverflow,
  bodySx,
  allowFullScreen,
  titleBottomContent,
  fullWidth = true,
  hideBackdrop,
  maxWidth = "md",
  autoWidth,
  headerSx,
}) => {
  const [fullScreen, setFullScreen] = useState(false);

  const _maxWidth = useMemo(() => {
    if (autoWidth) {
      return false;
    }
    return maxWidth;
  }, [maxWidth, autoWidth]);

  const _fullWidth = useMemo(() => {
    if (autoWidth) {
      return false;
    }
    return fullWidth;
  }, [autoWidth, fullWidth]);

  const modalStyles = useMemo(() => {
    let styles = {};
    if (fullScreen) {
      styles = {
        "& .MuiDialog-paper": {
          width: "100%",
          maxWidth: "100%",
          height: "100%",
          maxHeight: "100%",
          margin: 0,
          borderRadius: 0,
          transition: "0.3s",
        },
      };
      return { ...styles, ...sx };
    }
    return sx || {}; // Return sx or empty object if sx is undefined
  }, [fullScreen, sx]);

  const toggleFullscreen = useCallback(() => {
    setFullScreen((prev) => !prev);
  }, []);

  const onModalClose = useCallback(() => {
    setFullScreen(false);
    onClose(false);
  }, []);
  return (
    <>
      <Dialog
        open={show}
        onClose={onModalClose}
        fullWidth={_fullWidth}
        maxWidth={_maxWidth}
        hideBackdrop={hideBackdrop}
        // TransitionComponent={Transition}
        sx={modalStyles}
      >
        <Header
          sx={headerSx}
          title={title}
          onClose={onModalClose}
          titleBottomContent={titleBottomContent}
          allowFullScreen={allowFullScreen}
          onFullscreenClick={toggleFullscreen}
          fullScreen={fullScreen}
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

const Header = ({
  title,
  onClose,
  sx,
  titleBottomContent,
  allowFullScreen,
  fullScreen,
  onFullscreenClick,
}) => {
  const styles = useMemo(() => {
    let sty = {
      position: "relative",
      overflow: "hidden",
      flexGrow: 0,
      flexShrink: 0,

      boxShadow: "rgba(0, 0, 0, 0.1) 0px 1px 2px 0px",
    };

    return {
      ...sty,
      ...sx,
    };
  }, [sx]);
  return (
    <>
      <ModalContent sx={styles}>
        <Flx fw jb ac>
          <Htag sx={{ lineHeight: 1.4 }} h2>
            {title}
          </Htag>

          <Flx ac g={0}>
            <FullscreenToggleButton
              allowFullScreen={allowFullScreen}
              fullScreen={fullScreen}
              onFullscreenClick={onFullscreenClick}
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
        {titleBottomContent}
      </ModalContent>
    </>
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
      <ModalContent sx={styles}>{children}</ModalContent>
    </>
  );
};

const FullscreenToggleButton = ({
  allowFullScreen,
  fullScreen,
  onFullscreenClick,
}) => {
  if (!allowFullScreen) {
    return null;
  }
  if (fullScreen) {
    return (
      <IconButton
        color="primary"
        size="small"
        sx={{
          background: blue[50],
          borderRadius: "4px",
        }}
        onClick={onFullscreenClick}
      >
        <FullscreenExitRounded />
      </IconButton>
    );
  }
  return (
    <Tooltip title={"Full Screen"} arrow>
      <IconButton
        color="primary"
        size="small"
        sx={{
          borderRadius: "4px",
        }}
        onClick={onFullscreenClick}
      >
        <FullscreenRounded />
      </IconButton>
    </Tooltip>
  );
};

export default BasicModal;
