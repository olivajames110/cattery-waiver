import { set } from "lodash";

const initStat = {};

const cachedDataReducer = (state = initStat, action) => {
  let newState = { ...state };

  switch (action.type) {
    case "CACHED_DATA_SET":
      return action.payload;

    case "CACHED_DATA_UPDATE":
      return set(newState, action.payload.key, action.payload.value);

    case "CACHED_DATA_ITEM_SET":
      if (!newState[action.payload.itemName]) {
        newState[action.payload.itemName] = {};
      }
      newState[action.payload.itemName] = action.payload.itemValue;
      return newState;
    case "CACHED_DATA_ITEM_UPDATE":
      return set(
        newState,
        newState[action.payload.itemName]?.[action.payload.itemNameKey],
        action.payload.value
      );

    case "CACHED_DATA_ITEM_CLEAR":
      return set(newState, action.payload, null);

    case "CACHED_DATA_ARRAY_ITEM_UPDATE":
      const { arrayName, itemId, updates, replaceEntire } = action.payload;

      if (!newState[arrayName] || !Array.isArray(newState[arrayName])) {
        return newState; // Array doesn't exist, return state unchanged
      }

      // Create a new array with the updated item
      const updatedArray = newState[arrayName].map((item) => {
        if (item._id === itemId) {
          // Either replace the entire object or merge updates with existing item
          return replaceEntire ? { ...updates } : { ...item, ...updates };
        }
        return item;
      });

      // Update the state with the new array
      return { ...newState, [arrayName]: updatedArray };

    case "CACHED_DATA_CLEAR":
      return initStat;

    default:
      return state;
  }
};

export default cachedDataReducer;
