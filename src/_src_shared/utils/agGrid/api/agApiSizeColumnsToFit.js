/**
 * Example usage:
    const onFirstDataRendered = useCallback((params) => {
      agApiSizeColumnsToFit(params);
    }, []);
 */

export const agApiSizeColumnsToFit = (params) => {
  if (!params || !params.api) {
    console.warn("agApiSizeColumnsToFit: params or params.api is undefined");
    return;
  }

  params.api.sizeColumnsToFit();
};
