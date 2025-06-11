import {
  CloseRounded,
  ExpandLess,
  ExpandMore,
  KeyboardTab,
  MenuRounded,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import React, { Fragment, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { NavLink, useLocation } from "react-router-dom";
import Flx from "../../components/layout/Flx";
// import LinkListGroup from "../AuthenticatedDashboard/components/LinkListGroup";
// import LinkDropdown from "../AuthenticatedDashboard/components/LinkDropdown";
// import LinkListItem from "../AuthenticatedDashboard/components/LinkListItem";
import DashboardLogo from "../../assets/DashboardLogo";
import { navSidebarToggle } from "../../redux/actions/navSidebarActions";
import { isNil } from "lodash";
import DashboardPanelSvg from "./assets/DashboardPanelSvg";
import DashboardRoot from "./ui/DashboardRoot";
import DashboardMain from "./ui/DashboardMain";
import DashboardSidebarPane from "./ui/DashboardSidebarPane";
// import CliffcoLogo from "../assets/CliffcoLogo";
// import LinkDropdown from "../AuthenticatedDashboard/components/LinkDropdown";
// import LinkListGroup from "../AuthenticatedDashboard/components/LinkListGroup";
// import LinkListItem from "../AuthenticatedDashboard/components/LinkListItem";
// import Flx from "../components/layout/Flx";
// import { navSidebarToggle } from "../redux/actions/navSidebarActions";

const getItemStyles = ({ theme, isActive, collapsed }) => ({
  // padding: "10px 8px",
  // // padding: "12px 8px",
  // fontSize: "11px",
  // // fontSize: "12.8px",
  // borderRadius: "4px",
  // display: "flex",
  // gap: "6px",
  // alignItems: "center",
  // justifyContent: collapsed ? "center" : "flex-start",
  // textWrap: "nowrap",
  // fontFamily: "var(--primaryFont)",
  // // fontFamily: "var(--inter)",
  // fontWeight: isActive ? 700 : 500,
  // background: isActive ? "#ffffff24" : "none",
  // // background: isActive ? "#2962ff1f" : "none",
  // color: isActive ? theme.palette.primary.main : "inherit",
  // borderRight: isActive ? `4px solid #8b57f3` : "4px solid transparent",
  // // borderRight: isActive
  // //   ? `4px solid ${theme.palette.primary.main}`
  // //   : "4px solid transparent",
  // width: "100%",
  // textDecoration: "none",
  // zIndex: 111,
  // cursor: "pointer",

  padding: "12px 8px",
  fontSize: "12.8px",
  borderRadius: "4px",
  display: "flex",
  gap: "6px",
  alignItems: "center",
  justifyContent: collapsed ? "center" : "flex-start",
  textWrap: "nowrap",
  fontFamily: "var(--primaryFont)",
  // fontFamily: "var(--inter)",
  fontWeight: isActive ? 700 : 500,
  background: isActive ? "#2962ff1f" : "none",
  color: isActive ? theme.palette.primary.main : "inherit",
  borderRight: isActive
    ? `4px solid ${theme.palette.primary.main}`
    : "4px solid transparent",
  width: "100%",
  textDecoration: "none",
  zIndex: 111,
  cursor: "pointer",
});

const DashboardLayout = ({
  sidebar,
  navContent,
  open = true,
  children,
  topLinks,
  bottomLinks,
}) => {
  const isMobile = useMediaQuery("(max-width:768px)");
  return (
    <DashboardRoot isMobile={isMobile}>
      <NavRenderer isMobile={isMobile} open={open}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
          }}
        >
          <LinksRenderer open={open} links={topLinks} />
          <LinksRenderer open={open} links={bottomLinks}>
            {/* <LinkListGroup collapsed={!open}>
              <NavLinkLogoutButton collapsed={!open} />
            </LinkListGroup> */}
          </LinksRenderer>
        </Box>
      </NavRenderer>
      <DashboardMain>{children}</DashboardMain>
    </DashboardRoot>
  );
};

const LinksRenderer = ({ open, links, children }) => {
  return (
    <Flx column>
      {links.map((group, idx) => (
        <Fragment key={idx}>
          {/* insert a divider before the 3rd section */}
          {group?.divider === "top" && <Divider sx={{ my: 1 }} />}
          {/* {idx === 2 && <Divider sx={{ my: 1 }} />} */}

          <Flx column>
            <LinkListGroup collapsed={!open} title={group.title}>
              {group.items.map((item) =>
                item.children ? (
                  <LinkDropdown
                    key={item.label}
                    collapsed={!open}
                    icon={item.icon}
                    label={item.label}
                  >
                    {item.children.map((child) => (
                      <LinkListItem
                        key={child.label}
                        collapsed={!open}
                        to={child.to}
                        label={child.label}
                      />
                    ))}
                  </LinkDropdown>
                ) : item?.component ? (
                  item.component
                ) : (
                  <LinkListItem
                    key={item.label}
                    collapsed={!open}
                    icon={item.icon}
                    to={item.to}
                    onClick={item.onClick}
                    label={item.label}
                  />
                )
              )}
            </LinkListGroup>
          </Flx>
          {group?.divider === "bottom" && <Divider sx={{ my: 1 }} />}
        </Fragment>
      ))}
      {children}
    </Flx>
  );
};

/**
 * MOBILE
 */

const NavRenderer = ({ isMobile, open, children }) => {
  if (isMobile) {
    return <MobileNavbar>{children}</MobileNavbar>;
  }
  return (
    <DashboardSidebarPane open={!isMobile} drawerWidth={open ? 220 : 60}>
      <Flx
        fw
        column
        sx={{
          position: "relative",
          pt: 2,
          pb: 2,
          zIndex: 222,
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          minHeight: "58px",
          // pl: 2,
          // background: grey[900],
          flexShrink: 0,
          flexWrap: "wrap",
          // boxShadow:
          //   "rgba(0, 0, 0, 0.32) 0px 0px 1px, rgba(0, 0, 0, 0.08) 0px 0px 2px, rgba(0, 0, 0, 0.08) 0px 1px 3px",
        }}
      >
        <ToggleDashboardSidebarButton open={open} />
        {open ? <DashboardLogo white width={!open ? "28px" : "82px"} /> : null}
      </Flx>
      {children}
    </DashboardSidebarPane>
  );
};

const MobileNavbar = ({ children }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");
  const headerHeight = "50px";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const PRIMARY_COLOR = "#ffffff";
  return (
    <>
      <Flx
        fw
        g={2}
        ac
        jb
        sx={{
          position: "relative",
          // pt: 2,
          height: headerHeight,
          // background: grey[900],
          background: "#ffffff",
          pl: 1,
          pr: 1,
          zIndex: 222,

          flexWrap: "wrap",
          // svg: {
          //   color: PRIMARY_COLOR,
          // },
          boxShadow:
            "rgba(0, 0, 0, 0.32) 0px 0px 1px, rgba(0, 0, 0, 0.08) 0px 0px 2px, rgba(0, 0, 0, 0.08) 0px 1px 3px",
        }}
      >
        <DashboardLogo
          color={PRIMARY_COLOR}
          //
          width="28px"
        />
        <IconButton onClick={() => setOpen((s) => !s)}>
          {open ? <CloseRounded /> : <MenuRounded />}
        </IconButton>
      </Flx>
      <MobileNavDrawer open={open} headerHeight={headerHeight}>
        {children}
      </MobileNavDrawer>
    </>
  );
};

const MobileNavDrawer = ({
  headerHeight,
  drawerWidth = "100%",
  open = true,
  children,
}) => {
  return (
    <>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          zIndex: 221,
          "& .MuiDrawer-paper": {
            // top: headerHeight,
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
            height: "100%",
            overflowY: "auto",
            pt: 6,
          }}
        >
          {children}
        </Box>
      </Drawer>
    </>
  );
};

const ToggleDashboardSidebarButton = ({ open }) => {
  const [hover, setHover] = useState(false);
  const dispatch = useDispatch();
  const onToggle = () => {
    dispatch(navSidebarToggle());
  };

  return (
    <Tooltip
      title={open ? "Collapse" : "Expand"}
      placement="right"
      arrow
      disableInteractive
    >
      <IconButton
        onClick={onToggle}
        size="small"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateY(-50%)",
          // right: "17px",
          left: "14px",
          width: "28px",
          height: "28px",
          p: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: (theme) => theme.palette.text.primary,
        }}
      >
        {!hover && <DashboardPanelSvg height={20} />}
        {hover && (
          <KeyboardTab
            sx={{
              fontSize: 12,
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "0.3s",
            }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
};

const LinkListItem = ({ label, to, icon, onClick, collapsed }) => {
  const theme = useTheme();

  return (
    <ListItem disablePadding>
      <Tooltip
        title={collapsed ? label : ""}
        placement="right"
        arrow
        disableInteractive
      >
        <NavLink
          to={to}
          end
          style={(navData) =>
            getItemStyles({
              theme,
              isActive: isNil(to) ? false : navData?.isActive,
              collapsed,
            })
          }
          onClick={onClick}
        >
          {icon}
          {!collapsed && label}
        </NavLink>
      </Tooltip>
    </ListItem>
  );
};

// --------------------------------
// Group "section" title wrapper
// --------------------------------
const LinkListGroup = ({ title, children, collapsed }) => {
  return (
    <Flx
      column
      className="link-list-group"
      sx={{
        p: collapsed ? 0 : 2,
        paddingTop: collapsed || isNil(title) ? 0 : "20px",
        // paddingTop: collapsed || isNil(title) ? 0 : "24px",
        a: {
          fontSize: "11px !important",
        },
        ".MuiSvgIcon-root": {
          fontSize: "14px",
          // fontSize: "16px",
        },
      }}
    >
      <GroupTitle collapsed={collapsed}>{title}</GroupTitle>
      <List className="link-list" sx={{ pb: 0 }}>
        {children}
      </List>
    </Flx>
  );
};

const GroupTitle = ({ children, collapsed }) => {
  if (collapsed || isNil(children)) {
    return null;
  }
  return (
    <Typography
      className="link-list-group-title"
      textTransform={"uppercase"}
      fontSize={"11px"}
      fontWeight={500}
      color={grey[600]}
    >
      {children}
    </Typography>
  );
};

// --------------------------------
// Dropdown link component
// --------------------------------
const LinkDropdown = ({ label, icon, children, collapsed }) => {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <>
      <ListItem disablePadding className="link-list-item">
        <ListItemButton
          className="link-list-item-button"
          onClick={handleClick}
          sx={{
            ...getItemStyles({
              theme,
              // isActive: open, // treat "open" as "active"
              collapsed,
            }),
          }}
        >
          {icon}
          {!collapsed && label}
          {!collapsed && (open ? <ExpandLess /> : <ExpandMore />)}
        </ListItemButton>
      </ListItem>

      <Collapse in={open} timeout="auto" unmountOnExit>
        <List
          component="div"
          disablePadding
          sx={{
            ml: 1.8,
            pl: 1,
            borderLeft: `1px solid ${grey[300]}`,
            a: {
              fontWeight: "400 !important",
            },
          }}
        >
          {children}
        </List>
      </Collapse>
    </>
  );
};

export default DashboardLayout;
