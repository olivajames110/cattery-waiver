import { CloseRounded } from "@mui/icons-material";
import { Dialog, Drawer, IconButton, Slide, Tooltip } from "@mui/material";
import { isString } from "lodash";
import React, { useMemo } from "react";

import Flx from "../layout/Flx";
import Htag from "../typography/Htag";
import ModalContent from "./shared/ModalContent";

const shadow1 = "rgba(0, 0, 0, .1)";
const mediaInnerBorder = "rgba(0, 0, 0, .1)";
const shadowInset = "rgba(255, 255, 255, .5)";

const DockedDrawer = ({
  show,
  onClose,
  title,
  children,
  sx,
  drawerWidth = "800px",
  suppressBodyPadding,
  suppressBodyOverflow,
  bodySx,
  size,
  paperSx,
  height = "720px",
  anchor = "bottom",
  fullWidth = true,
  hideBackdrop,
  maxWidth = "md",
  autoWidth,
  headerSx,
}) => {
  const handleClose = () => {
    onClose(false);
  };

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

  const shared = {
    right: "60px",
    bottom: 0,
    top: "unset",
    left: "unset",
    minHeight: height,
    // minHeight: "800px",
    maxHeight: "60vh",
    width: drawerWidth,
  };
  return (
    <>
      <Drawer
        anchor={anchor}
        open={show}
        onClose={onClose}
        sx={{
          width: drawerWidth,
          flexShrink: 0,

          ...shared,
          "& .MuiDrawer-paper": {
            borderTopLeftRadius: "16px",
            borderTopRightRadius: "16px",
            boxSizing: "border-box",
            ...shared,
            // position: position,
          },
        }}
      >
        <Header sx={headerSx} title={title} onClose={handleClose} />
        <Body
          suppressBodyPadding={suppressBodyPadding}
          suppressBodyOverflow={suppressBodyOverflow}
          sx={bodySx}
        >
          {children}
        </Body>
      </Drawer>
    </>
  );
};

const Header = ({ title, onClose, sx }) => {
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
      <ModalContent sx={styles}>
        <Flx fw jb ac>
          <Htag sx={{ lineHeight: 1.4 }} h2>
            {title}
          </Htag>

          <Flx ac g={0}>
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
      </ModalContent>
    </>
  );
};

const Body = ({ children, suppressBodyPadding, suppressBodyOverflow, sx }) => {
  const styles = useMemo(() => {
    let sty = {
      position: "relative",
      // position: "relative",
      overflow: "hidden",
      flexGrow: 1,
      // display: "flex",
      // flexDirection: "column",
    };

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

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default DockedDrawer;
