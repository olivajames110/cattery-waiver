import { set } from "lodash";

const initStat = null;

const loanDrilldownReducer = (state = initStat, action) => {
  let newState = { ...state };
  switch (action.type) {
    case "SET_LOAN_DRILLDOWN":
      return action.payload;

    case "SET_LOAN_DRILLDOWN_KEY":
      return set(newState, action.payload.key, action.payload.value);

    case "CLEAR_LOAN_DRILLDOWN":
      return initStat;

    default:
      return state;
  }
};

export default loanDrilldownReducer;
