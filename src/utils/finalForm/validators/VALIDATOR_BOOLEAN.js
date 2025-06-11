export const VALIDATOR_BOOLEAN = (value) =>
  value === undefined || value === null ? "Required" : undefined;
