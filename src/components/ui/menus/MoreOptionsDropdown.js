import { MoreVertRounded } from "@mui/icons-material";
import {
  Box,
  CircularProgress,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useCallback, useState } from "react";
import Txt from "../../typography/Txt";

const MoreOptionsDropdown = ({
  title,
  tooltip = "More Options",
  icon,
  items,
  keepOpenOnComponentInteract = false,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  // When a menu‐item is clicked, close the menu, then call its onClick
  // Note: If keepOpenOnComponentInteract is true, items with `component` will be wrapped
  // so that clicks inside that component do NOT bubble up to this handler.
  const handleItemClick = useCallback(
    (itemOnClick) => {
      handleClose();
      if (typeof itemOnClick === "function") {
        itemOnClick();
      }
    },
    [handleClose]
  );

  return (
    <>
      <Tooltip title={tooltip}>
        <IconButton
          sx={{
            ".MuiSvgIcon-root": {
              // Customize icon size if desired
            },
          }}
          onClick={handleOpen}
          size="small"
          color="primary"
        >
          {icon || <MoreVertRounded />}
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        sx={{
          ".MuiListItemIcon-root": {
            minWidth: "36px",
            ".MuiSvgIcon-root": {
              fontSize: "16px",
            },
          },
        }}
      >
        {title && (
          <Box
            sx={{
              p: 1.5,
              pt: 1,
              borderBottom: `1px solid ${grey[300]}`,
              mb: 1,
            }}
          >
            <Txt component="span" sx={{ fontSize: "12px", fontWeight: 500 }}>
              {title}
            </Txt>
          </Box>
        )}

        {items.map((item, idx) => {
          const isDisabled = Boolean(item.disabled) || Boolean(item.loading);
          const displayLabel = item.loading
            ? item.loadingLabel || item.label
            : item.label;

          // If a custom component is provided, optionally wrap it to stop propagation
          const renderComponent = () => {
            if (!item.component) {
              return null;
            }

            if (keepOpenOnComponentInteract) {
              // Wrap in a Box that stops click propagation,
              // so interacting inside won't close the menu.
              return (
                <Box
                  sx={{ width: "100%" }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {item.component}
                </Box>
              );
            }

            // If not keeping open on component interact, render as-is
            return item.component;
          };

          return (
            <MenuItem
              key={idx}
              onClick={() => {
                // Only attach click‐to‐close behavior if there's no custom component,
                // or if keepOpenOnComponentInteract is false.
                if (!item.component || !keepOpenOnComponentInteract) {
                  handleItemClick(item.onClick);
                }
                // Otherwise (custom component + keepOpenOnComponentInteract), do nothing here:
                // clicks inside the wrapped component are already prevented from bubbling.
              }}
              disableRipple
              disabled={isDisabled}
              sx={{ position: "relative", px: 1.5 }}
            >
              {isDisabled && item.loading && (
                <CircularProgress
                  size={12}
                  sx={{
                    position: "absolute",
                    right: "8px",
                    top: "8px",
                  }}
                />
              )}

              {item.component ? (
                renderComponent()
              ) : (
                <>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText
                    sx={{
                      pr: 1.5,
                      span: { fontSize: "12px" },
                    }}
                  >
                    {displayLabel}
                  </ListItemText>
                </>
              )}
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

/**
 * Props for MoreOptionsDropdown:
 * - title: string (optional) – header at the top of the menu
 * - tooltip: string (optional) – tooltip text for the IconButton (“More Options” by default)
 * - icon: JSX.Element (optional) – override the default ••• icon
 * - items: Array<{
 *     label?: string,
 *     icon?: JSX.Element,
 *     onClick?: () => void,
 *     disabled?: boolean,
 *     loading?: boolean,
 *     loadingLabel?: string,
 *     component?: JSX.Element,    // ← if provided, this is rendered instead of icon+label
 *   }>
 * - keepOpenOnComponentInteract: boolean (default: false)
 *     – when true, any `item.component` is wrapped so that clicks inside it do NOT close the menu.
 *
 * Example usage with keepOpenOnComponentInteract:
 *
 * import { Switch, Typography, Box } from "@mui/material";
 *
 * const [showCompleted, setShowCompleted] = useState(false);
 * const [highlightRows, setHighlightRows] = useState(true);
 *
 * const tableOptionItems = [
 *   {
 *     component: (
 *       <Box
 *         sx={{
 *           width: "100%",
 *           display: "flex",
 *           alignItems: "center",
 *           justifyContent: "space-between",
 *         }}
 *       >
 *         <Typography variant="body2">Show Completed Rows</Typography>
 *         <Switch
 *           size="small"
 *           checked={showCompleted}
 *           onChange={(e) => setShowCompleted(e.target.checked)}
 *         />
 *       </Box>
 *     ),
 *   },
 *   {
 *     component: (
 *       <Box
 *         sx={{
 *           width: "100%",
 *           display: "flex",
 *           alignItems: "center",
 *           justifyContent: "space-between",
 *         }}
 *       >
 *         <Typography variant="body2">Enable Row Highlighting</Typography>
 *         <Switch
 *           size="small"
 *           checked={highlightRows}
 *           onChange={(e) => setHighlightRows(e.target.checked)}
 *         />
 *       </Box>
 *     ),
 *   },
 *   {
 *     label: "Refresh Table",
 *     icon: <RefreshRounded fontSize="small" />,
 *     onClick: () => refreshTable(),
 *   },
 * ];
 *
 * <MoreOptionsDropdown
 *   title="Table Settings"
 *   tooltip="Table Options"
 *   items={tableOptionItems}
 *   keepOpenOnComponentInteract={true}
 * />
 */

export default MoreOptionsDropdown;
