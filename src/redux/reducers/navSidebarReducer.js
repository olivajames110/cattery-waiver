import { set } from "lodash";

const initState = {
  open: true,
};

const navSidebarReducer = (state = initState, action) => {
  // Create a shallow copy to modify
  let newState = { ...state };

  switch (action.type) {
    case "SET_NAV_SIDEBAR":
      return action.payload;

    case "TOGGLE_NAV_SIDEBAR":
      newState.open = !newState.open;
      return newState;

    case "OPEN_NAV_SIDEBAR":
      newState.open = true;
      return newState;

    case "CLOSE_NAV_SIDEBAR":
      newState.open = false;
      return newState;

    case "SET_NAV_SIDEBAR_KEY":
      return set(newState, action.payload.key, action.payload.value);

    case "CLEAR_NAV_SIDEBAR":
      return initState;

    default:
      return state;
  }
};

export default navSidebarReducer;
