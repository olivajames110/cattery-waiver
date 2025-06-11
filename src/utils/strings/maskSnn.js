import { isString } from "lodash";

export const maskSnn = (ssn) => {
  // Check if the input is a valid SSN format (e.g., "123-45-6789" or "123456789")

  if (!isString(ssn)) {
    return ssn;
  }
  const ssnPattern = /^\d{3}-?\d{2}-?\d{4}$/;

  if (!ssnPattern.test(ssn)) {
    // throw new Error("Invalid SSN format.");
    return "Invalid SSN";
  }

  // Remove any dashes if present
  const cleanSSN = ssn.replace(/-/g, "");

  // Mask the first five digits and keep the last four visible
  const maskedSSN = `***-**-${cleanSSN.slice(-4)}`;

  return maskedSSN;
};
