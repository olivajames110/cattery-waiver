export const mapObjectKeysToColDefs = (object) => {
  return Object.keys(object).map((k) => {
    return { field: k };
  });
};
