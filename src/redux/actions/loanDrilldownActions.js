export const loanDrilldownSet = (state) => {
  return {
    type: "SET_LOAN_DRILLDOWN",
    payload: state,
  };
};

export const loanDrilldownSetKey = ({ key, value }) => {
  return {
    type: "SET_LOAN_DRILLDOWN_KEY",
    payload: { key, value },
  };
};

export const loanDrilldownClear = () => {
  return {
    type: "CLEAR_LOAN_DRILLDOWN",
  };
};
