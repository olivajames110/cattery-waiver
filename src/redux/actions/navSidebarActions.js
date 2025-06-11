// Existing actions
export const navSidebarSet = (sidebarState) => ({
  type: "SET_NAV_SIDEBAR",
  payload: sidebarState,
});

export const navSidebarToggle = () => ({
  type: "TOGGLE_NAV_SIDEBAR",
});

export const navSidebarOpen = () => ({
  type: "OPEN_NAV_SIDEBAR",
});

export const navSidebarClose = () => ({
  type: "CLOSE_NAV_SIDEBAR",
});

export const navSidebarSetKeyValue = (key, value) => ({
  type: "SET_NAV_SIDEBAR_KEY",
  payload: { key, value },
});

export const navSidebarClear = () => ({
  type: "CLEAR_NAV_SIDEBAR",
});
