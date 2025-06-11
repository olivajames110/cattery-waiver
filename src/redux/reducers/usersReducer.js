const initStat = null;

const usersReducer = (state = initStat, action) => {
  switch (action.type) {
    case "USERS_SET":
      return action.payload;

    case "USERS_CLEAR":
      return initStat;

    case "USERS_ADD":
      return state ? [action.payload, ...state] : [action.payload];

    default:
      return state;
  }
};

export default usersReducer;
