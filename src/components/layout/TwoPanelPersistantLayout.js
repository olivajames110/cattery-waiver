import { styled } from "@mui/material/styles";
import { Box, Drawer, useTheme } from "@mui/material";

const drawerWidth = 640; // Define drawer width
// const drawerWidth = 720; // Define drawer width

const TwoPanelPersistentLayout = ({
  open,
  sidebar,
  position = "absolute",
  sidebarPosition = "right", // Default to "right"
  children,
}) => {
  const theme = useTheme();
  const isRight = sidebarPosition === "right";

  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {sidebarPosition === "left" && open && (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              position: position,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="left"
          open={open}
        >
          {sidebar}
        </Drawer>
      )}
      <Main open={open} isRight={isRight} component="main">
        {children}
      </Main>
      {sidebarPosition === "right" && open && (
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              position: position,
              boxSizing: "border-box",
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          {sidebar}
        </Drawer>
      )}
    </Box>
  );
};

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "open" && prop !== "isRight",
})(({ theme, open, isRight }) => ({
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowY: "auto",
  //   marginLeft: isRight ? 0 : open ? `${drawerWidth}px` : 0,
  //   marginRight: isRight ? (open ? 0 : `-${drawerWidth}px`) : 0,
  transition: theme.transitions.create("margin", {
    easing: open
      ? theme.transitions.easing.easeOut
      : theme.transitions.easing.sharp,
    duration: open
      ? theme.transitions.duration.enteringScreen
      : theme.transitions.duration.leavingScreen,
  }),
}));

export default TwoPanelPersistentLayout;
