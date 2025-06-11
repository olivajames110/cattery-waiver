export const userActionSet = (state) => {
  return {
    type: "USER_SET",
    payload: state,
  };
};

export const userActionClear = () => {
  return {
    type: "USER_CLEAR",
  };
};
