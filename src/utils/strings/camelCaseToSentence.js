export const camelCaseToSentence = (camelCaseString) => {
  return camelCaseString
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/([a-z])([A-Z])/g, "$1 $2") // Add a space before capital letters
    .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
};
