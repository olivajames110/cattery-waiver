export const setAgGridState = (ref, gridState) => {
  if (ref.current) {
    const api = ref.current.api;
    const columnApi = ref.current.columnApi;

    // Sidebar
    if (gridState.sideBar) {
      api.setSideBarVisible(gridState.sideBar.visible);
      api.setSideBarPosition(gridState.sideBar.position);
      if (gridState.sideBar.openToolPanel) {
        api.openToolPanel(gridState.sideBar.openToolPanel);
      }
    }

    // Row Grouping
    if (gridState.rowGroup) {
      api.setRowGroupColumns(gridState.rowGroup.groupColIds);
    }

    // Aggregation
    if (gridState.aggregation) {
      columnApi.applyColumnState({
        state: gridState.aggregation.aggregationModel.map((agg) => ({
          colId: agg.colId,
          aggFunc: agg.aggFunc,
        })),
      });
    }

    // Pivot Mode
    if (gridState.pivot) {
      api.setPivotMode(gridState.pivot.pivotMode);
      api.setPivotColumns(gridState.pivot.pivotColIds);
    }

    // Column Pinning
    if (gridState.columnPinning) {
      columnApi.applyColumnState({
        state: [
          ...gridState.columnPinning.leftColIds.map((colId) => ({ colId, pinned: "left" })),
          ...gridState.columnPinning.rightColIds.map((colId) => ({ colId, pinned: "right" })),
        ],
        applyOrder: true,
      });
    }

    // Column Visibility
    if (gridState.columnVisibility) {
      columnApi.applyColumnState({
        state: gridState.columnVisibility.hiddenColIds.map((colId) => ({ colId, hide: true })),
      });
    }

    // Column Sizing
    if (gridState.columnSizing) {
      columnApi.applyColumnState({
        state: gridState.columnSizing.columnSizingModel.map((col) => ({
          colId: col.colId,
          width: col.width,
        })),
      });
    }

    // Column Order
    if (gridState.columnOrder) {
      columnApi.applyColumnState({
        state: gridState.columnOrder.orderedColIds.map((colId) => ({ colId })),
        applyOrder: true,
      });
    }

    // Row Group Expansion
    if (gridState.rowGroupExpansion) {
      api.forEachNode((node) => {
        const groupId = node.key;
        if (gridState.rowGroupExpansion.expandedRowGroupIds.includes(groupId)) {
          node.setExpanded(true);
        } else {
          node.setExpanded(false);
        }
      });
    }

    // Pagination
    if (gridState.pagination) {
      api.paginationGoToPage(gridState.pagination.page);
    }

    // Focused Cell
    if (gridState.focusedCell) {
      api.setFocusedCell(gridState.focusedCell.rowIndex, gridState.focusedCell.colId);
    }

    // Scroll
    if (gridState.scroll) {
      api.ensureIndexVisible(gridState.scroll.top);
      api.ensureColumnVisible(gridState.scroll.left);
    }
  }
};
