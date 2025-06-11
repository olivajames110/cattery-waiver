export const VALIDATOR_REQUIRE = (value) => {
  // If no value is provided (undefined/null) or it's an empty string, then it’s invalid.
  // Otherwise it’s valid (including `false` for booleans).
  if (value === undefined || value === null) {
    return "Required";
  }
  if (typeof value === "string" && value.trim() === "") {
    return "Required";
  }
  return undefined;
};
