import React, {
  memo,
  useMemo,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import { useDispatch } from "react-redux";
import { sidebarClear } from "../../../redux/actions/sidebarActions";
import { Box, IconButton, Tooltip } from "@mui/material";
import { blueGrey, grey } from "@mui/material/colors";
import ScreenContent from "../../../components/layout/ScreenContent";
import Htag from "../../../components/typography/Htag";
import { CloseRounded, DragHandleRounded } from "@mui/icons-material";
import Flx from "../../../components/layout/Flx";
import { over } from "lodash";

const COLLAPSE_THRESHOLD = 220; // Width in pixels below which sidebar will auto-close

const DrilldownSidebarPane = memo(
  ({
    title,
    children,
    bodySx,
    fixedWidth,
    maxWidth = "80vw",
    // maxWidth = "50vw",
    // maxWidth = "34vw",
    initialWidth = "28vw",
    // initialWidth = "22vw",
    // initialWidth = "420px",
    minWidth = "200px",
    variant = "inline", // inline || fixed
    bodyOverflow = "auto",
    sx,
    onCloseIcon = <CloseRounded />,
    onClose,
    bodyPadding = 2,
  }) => {
    const dispatch = useDispatch();
    const sidebarRef = useRef(null);
    const resizeDivRef = useRef(null);
    const [isResizing, setIsResizing] = useState(false);
    const [width, setWidth] = useState(initialWidth);
    const startXRef = useRef(0);
    const startWidthRef = useRef(0);

    // Convert string width values to numbers for calculations
    const getNumericWidth = (widthStr) => {
      if (typeof widthStr === "number") return widthStr;
      if (typeof widthStr !== "string") return 640; // Default fallback

      // Handle pixel values
      if (widthStr.endsWith("px")) {
        return parseInt(widthStr, 10);
      }
      // Handle vw values
      if (widthStr.endsWith("vw")) {
        const percentage = parseInt(widthStr, 10);
        return (percentage / 100) * window.innerWidth;
      }
      // If no units, assume pixels
      return parseInt(widthStr, 10) || 640;
    };

    const numericMinWidth = getNumericWidth(minWidth);
    const numericMaxWidth = getNumericWidth(maxWidth);

    const handleOnClose = () => {
      if (onClose) {
        onClose();
      }
      dispatch(sidebarClear());
    };

    const startResizing = useCallback((e) => {
      e.preventDefault();
      if (sidebarRef.current) {
        const sidebarRect = sidebarRef.current.getBoundingClientRect();
        startXRef.current = e.clientX;
        startWidthRef.current = sidebarRect.width;
      }
      setIsResizing(true);

      // Add a transparent overlay to prevent iframe from capturing mouse events
      const overlay = document.createElement("div");
      overlay.id = "resize-overlay";
      overlay.style.position = "fixed";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.zIndex = "10000";
      overlay.style.cursor = "ew-resize";
      document.body.appendChild(overlay);
    }, []);

    const stopResizing = useCallback(() => {
      setIsResizing(false);

      // Remove the overlay
      const overlay = document.getElementById("resize-overlay");
      if (overlay) {
        document.body.removeChild(overlay);
      }

      // Check if we should auto-close the sidebar based on final width
      if (sidebarRef.current) {
        const currentWidth = sidebarRef.current.getBoundingClientRect().width;
        if (currentWidth < COLLAPSE_THRESHOLD) {
          handleOnClose();
        }
      }
    }, [handleOnClose]);

    const resize = useCallback(
      (e) => {
        if (isResizing && sidebarRef.current) {
          // Calculate the new width based on the distance moved
          const deltaX = e.clientX - startXRef.current;
          const newWidth = startWidthRef.current - deltaX;

          // Apply min/max constraints
          const clampedWidth = Math.max(
            numericMinWidth,
            Math.min(numericMaxWidth, newWidth)
          );

          // Set the width in pixels
          setWidth(`${clampedWidth}px`);
        }
      },
      [isResizing, numericMinWidth, numericMaxWidth]
    );

    // Add event listeners for resizing
    useEffect(() => {
      const handleMouseMove = (e) => {
        resize(e);
      };

      const handleMouseUp = (e) => {
        stopResizing();
      };

      if (isResizing) {
        // Use window to capture events outside the component
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
      }

      return () => {
        // Clean up event listeners when component unmounts or when isResizing changes
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isResizing, resize, stopResizing]);

    const styles = useMemo(() => {
      let defaultStyles = {
        maxWidth: fixedWidth || maxWidth,
        flexGrow: 0,
        background: "#ffffff",
        flexShrink: 0,
        minWidth: fixedWidth || minWidth,
        flexBasis: fixedWidth || width,
        width: fixedWidth || width,
        overflow: "hidden",
        display: "flex",
        height: "100%",
        borderLeft: `1px solid ${blueGrey[100]}`,
        borderRight: `1px solid ${blueGrey[100]}`,
        flexDirection: "column",
        zIndex: 111,
        position: "relative", // For absolute positioning of resize handle
        // position: "fixed",
        // top: 0,
        // right: 0,
        // height: "100%",

        boxShadow:
          "rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px",
        // boxShadow: "-20px 0px 18px rgba(0, 0, 0, 0.08)",
        // "-20px 0px 18px rgba(0, 0, 0, 0.08), 0 25px 60px rgb(0 0 0 / 2%)",
        // boxShadow:
        //   "0 15px 35px rgba(0, 0, 0, 0.08), 0 25px 60px rgba(0, 0, 0, 0.06)",
      };

      if (variant === "fixed") {
        defaultStyles = {
          ...defaultStyles,
          position: "fixed",
          top: 0,
          right: 0,
          backgroundColor: "#ffffff",
          boxShadow:
            "0 15px 35px rgba(0, 0, 0, 0.08), 0 25px 60px rgba(0, 0, 0, 0.06)",
          height: "100%",
          ".sidebar-pane-body": {
            overflowY: "auto",
          },
        };
      }
      return { ...defaultStyles, ...sx };
    }, [sx, variant, fixedWidth, maxWidth, width, minWidth]);

    const resizeHandleStyles = {
      position: "absolute",
      top: 0,
      left: 0,
      width: "5px",
      height: "100%",
      cursor: "ew-resize",
      zIndex: 112,

      "&:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.1)",
      },

      ...(isResizing && {
        backgroundColor: "rgba(0, 0, 0, 0.15)",
      }),
    };

    return (
      <Box
        sx={{
          height: "100%",
          position: "relative",
          "& .sidebar-resize-handle-button:hover ~ .sidebar-container .sidebar-resize-handle":
            {
              backgroundColor: "rgba(0, 0, 0, 0.1)",
            },
        }}
      >
        <Box
          onMouseDown={startResizing}
          className="sidebar-resize-handle-button"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#ffffff",
            border: "1px solid #e0e0e0",
            borderRadius: "4px",
            position: "absolute",
            top: "50%",
            left: "-7px",
            width: "18px",
            overflow: "hidden",
            cursor: "w-resize",
            zIndex: 11113,
            transform: "translateY(-50%)",
            "&:hover": {
              backgroundColor: grey[200],
            },
          }}
        >
          <DragHandleRounded
            sx={{ transform: "rotate(90deg)", color: grey[600] }}
            className="thin"
          />
        </Box>

        {/* give this Box a class so our selector can find it */}
        <Box className="sidebar-container" sx={styles} ref={sidebarRef}>
          {/* the real resize handle */}
          <Box
            className="sidebar-resize-handle"
            sx={resizeHandleStyles}
            onMouseDown={startResizing}
            ref={resizeDivRef}
          />

          <ScreenContent
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexGrow: 0,
              pt: 1,
              pb: 1,
              pr: 1,
            }}
          >
            <Htag
              h2
              // h3
              sx={
                {
                  // fontSize: "18px",
                  // color: "var(--titleColor)",
                }
              }
            >
              {title}
            </Htag>
            <Tooltip title="Close Sidebar">
              <IconButton size="small" onClick={handleOnClose}>
                {onCloseIcon}
              </IconButton>
            </Tooltip>
          </ScreenContent>

          <ScreenContent
            className={"sidebar-pane-body"}
            sx={{
              flexGrow: 1,
              // pt: 1,
              overflowY: bodyOverflow,
              zIndex: 111,
              ...bodySx,
            }}
            padding={bodyPadding}
          >
            {children}
          </ScreenContent>
        </Box>
      </Box>
    );
  }
);

export default DrilldownSidebarPane;
