import { isNil } from "lodash";

export const getLoanByIdFromPipeline = (loanNumber, pipeline) => {
  if (isNil(loanNumber)) {
    console.error("Loan Number is null or undefined");
    return;
  }
  if (isNil(pipeline)) {
    console.error("Pipeline is null or undefined");
    return;
  }
  const loan = pipeline.find(
    (loan) => toString(loan?.loanNumber) === toString(loanNumber)
  );
  if (!loan) {
    throw new Error(`Loan with Number ${loanNumber} not found in pipeline`);
  }
  return loan;
};
