import { set } from "lodash";

const initStat = null;

const loanPipelineReducer = (state = initStat, action) => {
  let newState = { ...state };
  switch (action.type) {
    case "SET_LOAN_PIPELINE":
      return action.payload;

    case "SET_LOAN_PIPELINE_KEY":
      return set(newState, action.payload.key, action.payload.value);

    case "CLEAR_LOAN_PIPELINE":
      return initStat;

    default:
      return state;
  }
};

export default loanPipelineReducer;
