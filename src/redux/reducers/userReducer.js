const initStat = null;

const userReducer = (state = initStat, action) => {
  switch (action.type) {
    case "USER_SET":
      return action.payload;

    case "USER_CLEAR":
      return initStat;

    default:
      return state;
  }
};

export default userReducer;
