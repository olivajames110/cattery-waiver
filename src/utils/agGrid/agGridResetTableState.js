/**
  * For versions:
    "ag-charts-community": "^11.0.0",
    "ag-charts-enterprise": "^11.0.0",
    "ag-charts-react": "^11.0.0",
    "ag-grid-community": "^33.0.0",
    "ag-grid-enterprise": "^33.0.0",
    "ag-grid-react": "^33.0.0",
  */
export const agGridResetTableState = (ref) => {
  if (!ref?.current) return;

  const api = ref.current.api;

  // 1) Reset the column state to how columns were defined in the original columnDefs
  api.resetColumnState();

  // 2) Clear filters
  api.setFilterModel(null);

  // 3) Clear sorting via Column State
  api.applyColumnState({
    defaultState: { sort: null },
  });

  // 4) Remove any row grouping or pivoting (if you want them cleared)
  api.setRowGroupColumns([]);
  // api.setPivotMode(false);
  // api.setPivotColumns([]);

  // 5) Close side-bar / tool panel (optional)
  api.closeToolPanel();

  // 6) Reset scroll position to the first row, leftmost column
  api.ensureIndexVisible(0, "top");
  const [firstCol] = api.getColumnDefs() ?? [];
  if (firstCol?.field) {
    api.ensureColumnVisible(firstCol.field);
  }

  // 7) Clear row selection (optional)
  api.deselectAll();
};
