// src/.../LoanFilesTable/hooks/useHandleMetadataUpdate.js
import { useCallback } from "react";

export const useHandleMetadataUpdate = (
  selectedRows,
  originalRowData,
  setRowData,
  setChangedRows,
  gridRef
) => {
  return useCallback(
    ({
      newDocGroup,
      newDocType,
      newEffectiveDate,
      newGuidelineExpirationDays,
    }) => {
      if (!selectedRows || selectedRows.length === 0) return;

      // ←–– USE _id, not .id
      const selectedRowIds = selectedRows.map((row) => row._id);

      setRowData((prev) => {
        const updatedRows = [...prev];
        selectedRowIds.forEach((id) => {
          // ←–– MATCH against row._id, not row.id
          const index = updatedRows.findIndex((row) => row._id === id);
          if (index !== -1) {
            const rowToUpdate = updatedRows[index];
            const updatedRow = { ...rowToUpdate };
            const originalRow = originalRowData.find((r) => r._id === id) || {};

            // 1) Bulk DocGroup
            if (newDocGroup !== undefined) {
              updatedRow.docGroup = newDocGroup;
              updatedRow.docType = "";

              if (newDocGroup !== originalRow.docGroup) {
                setChangedRows((prevArr) => {
                  const exists = prevArr.find((item) => item._id === id);
                  if (exists) {
                    return prevArr.map((item) =>
                      item._id === id
                        ? { ...item, docGroup: newDocGroup }
                        : item
                    );
                  } else {
                    return [...prevArr, { _id: id, docGroup: newDocGroup }];
                  }
                });
              } else {
                setChangedRows((prevArr) => {
                  const exists = prevArr.find((item) => item._id === id);
                  if (!exists) return prevArr;
                  const updated = { ...exists };
                  delete updated.docGroup;
                  const keys = Object.keys(updated);
                  if (keys.length === 1 && keys[0] === "_id") {
                    return prevArr.filter((item) => item._id !== id);
                  }
                  return prevArr.map((item) =>
                    item._id === id ? updated : item
                  );
                });
              }

              // Also handle cleared docType
              const origDocType = originalRow.docType || "";
              if ("" !== origDocType) {
                setChangedRows((prevArr) => {
                  const exists = prevArr.find((item) => item._id === id);
                  if (exists) {
                    return prevArr.map((item) =>
                      item._id === id ? { ...item, docType: "" } : item
                    );
                  } else {
                    return [...prevArr, { _id: id, docType: "" }];
                  }
                });
              } else {
                setChangedRows((prevArr) => {
                  const exists = prevArr.find(
                    (item) => item._id === id && "docType" in item
                  );
                  if (!exists) return prevArr;
                  const updated = { ...exists };
                  delete updated.docType;
                  const keys = Object.keys(updated);
                  if (keys.length === 1 && keys[0] === "_id") {
                    return prevArr.filter((item) => item._id !== id);
                  }
                  return prevArr.map((item) =>
                    item._id === id ? updated : item
                  );
                });
              }
            }

            // 2) Bulk DocType (only if docGroup wasn’t changed this call)
            if (newDocType !== undefined && newDocGroup === undefined) {
              updatedRow.docType = newDocType || "";
              const origRow = originalRowData.find((r) => r._id === id) || {};
              if (updatedRow.docType !== origRow.docType) {
                setChangedRows((prevArr) => {
                  const exists = prevArr.find((item) => item._id === id);
                  if (exists) {
                    return prevArr.map((item) =>
                      item._id === id
                        ? { ...item, docType: updatedRow.docType }
                        : item
                    );
                  } else {
                    return [
                      ...prevArr,
                      { _id: id, docType: updatedRow.docType },
                    ];
                  }
                });
              } else {
                setChangedRows((prevArr) => {
                  const exists = prevArr.find((item) => item._id === id);
                  if (!exists) return prevArr;
                  const updated = { ...exists };
                  delete updated.docType;
                  const keys = Object.keys(updated);
                  if (keys.length === 1 && keys[0] === "_id") {
                    return prevArr.filter((item) => item._id !== id);
                  }
                  return prevArr.map((item) =>
                    item._id === id ? updated : item
                  );
                });
              }
            }

            // 3) Bulk Effective Date
            if (newEffectiveDate !== undefined) {
              let newISO = "";
              if (newEffectiveDate instanceof Date) {
                newISO = newEffectiveDate.toISOString();
              } else {
                newISO = newEffectiveDate;
              }
              updatedRow.reportEffectiveDate = newISO;
              const origVal = originalRow.reportEffectiveDate || "";
              if (newISO !== origVal) {
                setChangedRows((prevArr) => {
                  const exists = prevArr.find((item) => item._id === id);
                  if (exists) {
                    return prevArr.map((item) =>
                      item._id === id
                        ? { ...item, reportEffectiveDate: newISO }
                        : item
                    );
                  } else {
                    return [
                      ...prevArr,
                      { _id: id, reportEffectiveDate: newISO },
                    ];
                  }
                });
              } else {
                setChangedRows((prevArr) => {
                  const exists = prevArr.find((item) => item._id === id);
                  if (!exists) return prevArr;
                  const updated = { ...exists };
                  delete updated.reportEffectiveDate;
                  const keys = Object.keys(updated);
                  if (keys.length === 1 && keys[0] === "_id") {
                    return prevArr.filter((item) => item._id !== id);
                  }
                  return prevArr.map((item) =>
                    item._id === id ? updated : item
                  );
                });
              }
            }

            // 4) Bulk Guideline Expiration Days
            if (newGuidelineExpirationDays !== undefined) {
              updatedRow.reportGuidelineExpirationDays =
                newGuidelineExpirationDays;
              const origVal = originalRow.reportGuidelineExpirationDays;
              if (newGuidelineExpirationDays !== origVal) {
                setChangedRows((prevArr) => {
                  const exists = prevArr.find((item) => item._id === id);
                  if (exists) {
                    return prevArr.map((item) =>
                      item._id === id
                        ? {
                            ...item,
                            reportGuidelineExpirationDays:
                              newGuidelineExpirationDays,
                          }
                        : item
                    );
                  } else {
                    return [
                      ...prevArr,
                      {
                        _id: id,
                        reportGuidelineExpirationDays:
                          newGuidelineExpirationDays,
                      },
                    ];
                  }
                });
              } else {
                setChangedRows((prevArr) => {
                  const exists = prevArr.find((item) => item._id === id);
                  if (!exists) return prevArr;
                  const updated = { ...exists };
                  delete updated.reportGuidelineExpirationDays;
                  const keys = Object.keys(updated);
                  if (keys.length === 1 && keys[0] === "_id") {
                    return prevArr.filter((item) => item._id !== id);
                  }
                  return prevArr.map((item) =>
                    item._id === id ? updated : item
                  );
                });
              }
            }

            updatedRows[index] = updatedRow;
          }
        });

        return updatedRows;
      });

      // Force‐refresh the grid so the bulk values show up
      setTimeout(() => {
        if (gridRef.current && gridRef.current.api) {
          gridRef.current.api.refreshCells();
        }
      }, 0);
    },
    [selectedRows, originalRowData, setRowData, setChangedRows, gridRef]
  );
};
