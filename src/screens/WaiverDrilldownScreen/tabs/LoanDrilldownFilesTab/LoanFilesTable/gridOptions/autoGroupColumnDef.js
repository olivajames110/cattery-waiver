export const autoGroupColumnDef = {
  field: "docGroup",
  headerName: "Document Group",
  minWidth: 220,
  cellRendererParams: {
    suppressCount: true,
  },
  cellStyle: { fontWeight: "bold" },
  comparator: (valueA, valueB) => {
    if (valueA < valueB) return -1;
    if (valueA > valueB) return 1;
    return 0;
  },
};
