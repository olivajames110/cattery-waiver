import { CloseRounded } from "@mui/icons-material";
import { Dialog, IconButton, Tooltip } from "@mui/material";
import { useMemo } from "react";

import { grey } from "@mui/material/colors";
import Flx from "../layout/Flx";
import Htag from "../typography/Htag";
import ModalContent from "./shared/ModalContent";

const offset = 24;
const SideCardModal = ({
  show,
  onClose,
  title,
  children,

  drawerWidth = "800px",
  suppressBodyPadding,
  suppressBodyOverflow,
  bodySx,

  maxWidth = false,
  headerSx,
}) => {
  const handleClose = (_event, reason) => {
    // You can inspect `reason` if you only want to close on backdrop/escKey
    // e.g. if (reason === "backdropClick" || reason === "escapeKeyDown") { onClose(false); }
    onClose(false);
  };
  return (
    <>
      <Dialog
        open={show}
        onClose={handleClose}
        maxWidth={maxWidth}
        PaperProps={{
          sx: {
            width: drawerWidth,
            maxHeight: `calc(100% - ${offset * 2}px)`,
            borderRadius: "8px",
            m: 0,
            position: "absolute",
            maxWidth: "36vw",
            height: `calc(100% - ${offset * 2}px)`,
            // maxHeight: `calc(100% - ${offset * 2}px)`,
            right: offset,
            top: offset,
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
      </Dialog>
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
      borderBottom: `1px solid ${grey[300]}`,
      // boxShadow: `0 1px 2px ${shadow1},0 -1px ${mediaInnerBorder} inset,0 2px 1px -1px ${shadowInset} inset`,
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
          <Htag h1 sx={{ lineHeight: 1 }}>
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
  }, [sx, suppressBodyPadding, suppressBodyOverflow]);
  return (
    <>
      <ModalContent sx={styles}>{children}</ModalContent>
    </>
  );
};

export default SideCardModal;
