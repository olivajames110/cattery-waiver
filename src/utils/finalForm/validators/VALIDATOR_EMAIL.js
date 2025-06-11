export const VALIDATOR_EMAIL = (value) => {
  if (!value) {
    // If empty, no error (unless you're also requiring it separately)
    return undefined;
  }

  // Basic email pattern:
  const emailPattern = /^\S+@\S+\.\S+$/;
  if (!emailPattern.test(value)) {
    return "Invalid email address";
  }

  return undefined; // Means valid
};
