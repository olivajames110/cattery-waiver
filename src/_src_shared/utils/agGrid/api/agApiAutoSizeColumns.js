/**
 * Example usage:
    const onFirstDataRendered = useCallback((params) => {
      agApiAutoSizeColumns(params);
    }, []);
 */

export const agApiAutoSizeColumns = (params) => {
  if (!params || !params.api) {
    console.warn("agApiAutoSizeColumns: params or params.api is undefined");
    return;
  }
  params.api.autoSizeAllColumns();
};
