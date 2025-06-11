import { set } from "lodash";

const initState = {
  open: false,
  type: null,
  state: null,
};

const navSidebarReducer = (state = initState, action) => {
  // Create a shallow copy to modify
  let newState = { ...state };

  switch (action.type) {
    case "SET_SIDEBAR":
      return action.payload;

    case "TOGGLE_SIDEBAR":
      newState.open = !newState.open;
      return newState;

    case "OPEN_SIDEBAR":
      newState.open = true;
      return newState;

    case "CLOSE_SIDEBAR":
      newState.open = false;
      return newState;

    case "SET_SIDEBAR_KEY":
      return set(newState, action.payload.key, action.payload.value);

    case "CLEAR_SIDEBAR":
      return initState;

    case "SET_SIDEBAR_TYPE":
      newState.type = action.payload;
      return newState;

    case "CLEAR_SIDEBAR_TYPE":
      newState.type = null;
      return newState;

    case "SET_SIDEBAR_STATE":
      newState.state = action.payload;
      return newState;

    case "CLEAR_SIDEBAR_STATE":
      newState.state = null;
      return newState;

    case "SET_SIDEBAR_VALUES":
      // Payload should be an object like { name, state, open, ... }
      return {
        ...newState,
        ...action.payload,
      };

    case "TOGGLE_SIDEBAR_TYPE":
      // If current type matches the payload, set it to null; otherwise set it to the payload
      newState.type = newState.type === action.payload ? null : action.payload;
      return newState;

    default:
      return state;
  }
};

export default navSidebarReducer;
