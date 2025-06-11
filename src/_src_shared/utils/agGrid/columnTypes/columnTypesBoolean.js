export const columnTypesBoolean = (params = {}) => {
  const { suppressFilter } = params;
  return {
    boolean: {
      cellRenderer: "agCheckboxCellRenderer",
      cellEditor: "agCheckboxCellEditor",
      filter: suppressFilter ? undefined : "agMultiColumnFilter",
    },
  };
};
