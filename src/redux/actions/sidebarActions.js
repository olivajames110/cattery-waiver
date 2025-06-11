// Existing actions
export const sidebarSet = (sidebarState) => ({
  type: "SET_SIDEBAR",
  payload: sidebarState,
});

export const sidebarToggle = () => ({
  type: "TOGGLE_SIDEBAR",
});

export const sidebarOpen = () => ({
  type: "OPEN_SIDEBAR",
});

export const sidebarClose = () => ({
  type: "CLOSE_SIDEBAR",
});

export const sidebarSetKeyValue = (key, value) => ({
  type: "SET_SIDEBAR_KEY",
  payload: { key, value },
});

export const sidebarClear = () => ({
  type: "CLEAR_SIDEBAR",
});

// ---- NEW actions ----
export const sidebarTypeSet = (type) => ({
  type: "SET_SIDEBAR_TYPE",
  payload: type,
});

export const sidebarTypeToggle = (type) => ({
  type: "TOGGLE_SIDEBAR_TYPE",
  payload: type,
});

export const sidebarTypeClear = () => ({
  type: "CLEAR_SIDEBAR_TYPE",
});

export const sidebarSetStateValue = (someState) => ({
  type: "SET_SIDEBAR_STATE",
  payload: someState,
});

export const sidebarClearStateValue = () => ({
  type: "CLEAR_SIDEBAR_STATE",
});

/**
 * Usage
  dispatch(
  sidebarSetValues({
    name: "someName",
    state: "someState",
    open: true,
  })
);
 */
export const sidebarSetValues = (valuesObject) => {
  return {
    type: "SET_SIDEBAR_VALUES",
    payload: valuesObject,
  };
};
