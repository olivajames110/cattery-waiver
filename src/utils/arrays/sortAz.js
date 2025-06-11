export const sortAz = (array) => {
  if (!Array.isArray(array)) {
    return null; // or you could throw an error or return the input unchanged
  }

  return array.sort((a, b) => a.localeCompare(b));
};
