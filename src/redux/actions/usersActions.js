export const usersActionSet = (users) => ({
  type: "USERS_SET",
  payload: users,
});

export const usersActionClear = () => ({
  type: "USERS_CLEAR",
});

export const usersActionAdd = (user) => ({
  type: "USERS_ADD",
  payload: user,
});

// selector
export const getUserById = (state, id) => {
  if (!Array.isArray(state)) return null;
  return state.find((user) => user.id === id) || null;
};
