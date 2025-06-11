export const loanPipelineSet = (state) => {
  return {
    type: "SET_LOAN_PIPELINE",
    payload: state,
  };
};

export const loanPipelineSetKey = ({ key, value }) => {
  return {
    type: "SET_LOAN_PIPELINE_KEY",
    payload: { key, value },
  };
};

export const loanPipelineClear = () => {
  return {
    type: "CLEAR_LOAN_PIPELINE",
  };
};
