export const getAgGridRowData = (gridRef) => {
  let allRows = [];
  gridRef?.current?.api?.forEachNode((node) => {
    allRows.push(node?.data);
  });
  return allRows;
};
