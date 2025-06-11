export const cachedDataSet = (state) => {
  return {
    type: "CACHED_DATA_SET",
    payload: state,
  };
};

export const cachedDataUpdate = ({ key, value }) => {
  return {
    type: "CACHED_DATA_UPDATE",
    payload: { key, value },
  };
};

export const cachedDataClear = () => {
  return {
    type: "CACHED_DATA_CLEAR",
  };
};

export const cachedDataItemSet = (itemName, itemValue) => {
  console.log("as", itemName, itemValue);
  return {
    type: "CACHED_DATA_ITEM_SET",
    payload: { itemName, itemValue },
  };
};

export const cachedDataItemUpdate = (itemName, itemNameKey, value) => {
  return {
    type: "CACHED_DATA_ITEM_UPDATE",
    payload: { itemName, itemNameKey, value },
  };
};

export const cachedDataItemClear = (itemName) => {
  return {
    type: "CACHED_DATA_ITEM_CLEAR",
    payload: itemName,
  };
};

/**
 * Usage:
 * dispatch(cachedDataArrayItemUpdate("loanApps", "456", { loanNumber: "333" }));
 * dispatch(cachedDataArrayItemUpdate(
  "creditApps", 
  "456", 
  { _id: "456", loanNumber: "999", newProp: "value" }, 
  true
));
 */

export const cachedDataArrayItemUpdate = (
  arrayName,
  itemId,
  updates,
  replaceEntire = false
) => {
  return {
    type: "CACHED_DATA_ARRAY_ITEM_UPDATE",
    payload: { arrayName, itemId, updates, replaceEntire },
  };
};
