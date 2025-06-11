// src/components/LoanFilesTable/hooks/useHandleCellValueChanged.js
import { useCallback } from "react";

/**
 * Handles individual cell edits.
 *   • Updates the grid via applyTransaction({ update: [...] })
 *   • Re‐enters editing so focus is not lost (where appropriate)
 *   • Updates changedRows by diffing newValue vs original
 *
 * Expects:
 *   • originalRowData (array)
 *   • setChangedRows (state setter)
 */
export const useHandleCellValueChanged = (originalRowData, setChangedRows) => {
  return useCallback(
    (params) => {
      const { colDef, data, newValue } = params;
      const field = colDef.field;
      const rowId = data._id;
      const originalRow = originalRowData.find((r) => r._id === rowId) || {};

      // Helper to add/merge a field into changedRows
      const addOrUpdateChange = (fieldName, value) => {
        setChangedRows((prev) => {
          const exists = prev.find((item) => item._id === rowId);
          if (exists) {
            if (value !== undefined) {
              // Merge or update
              return prev.map((item) =>
                item._id === rowId ? { ...item, [fieldName]: value } : item
              );
            } else {
              // Remove that field if reverted to original
              const updated = { ...exists };
              delete updated[fieldName];
              const keys = Object.keys(updated);
              if (keys.length === 1 && keys[0] === "_id") {
                // No other fields → remove entire object
                return prev.filter((item) => item._id !== rowId);
              }
              return prev.map((item) => (item._id === rowId ? updated : item));
            }
          } else {
            if (value !== undefined) {
              // Create new entry
              return [...prev, { _id: rowId, [fieldName]: value }];
            }
            return prev;
          }
        });
      };

      // 1) Filename
      if (field === "file_display_name") {
        const originalExtension = data.name.split(".").pop().toLowerCase();
        const newValueWithoutExt = newValue.replace(/\.[^/.]+$/, "");
        data.file_display_name = `${newValueWithoutExt}.${originalExtension}`;

        params.api.applyTransaction({ update: [data] });

        const origValue = originalRow.file_display_name || "";
        if (data.file_display_name !== origValue) {
          addOrUpdateChange("file_display_name", data.file_display_name);
        } else {
          addOrUpdateChange("file_display_name", undefined);
        }
        return;
      }

      // 2) Category (docGroup)
      if (field === "docGroup") {
        data.docGroup = newValue;
        // Clear docType when category changes
        data.docType = "";

        params.api.applyTransaction({ update: [data] });

        // Re‐enter editing on the same cell
        setTimeout(() => {
          params.api.startEditingCell({
            rowIndex: params.node.rowIndex,
            colKey: "docGroup",
          });
        }, 0);

        const origDocGroup = originalRow.docGroup || "";
        if (data.docGroup !== origDocGroup) {
          addOrUpdateChange("docGroup", data.docGroup);
        } else {
          addOrUpdateChange("docGroup", undefined);
        }

        const origDocType = originalRow.docType || "";
        if (data.docType !== origDocType) {
          addOrUpdateChange("docType", data.docType);
        } else {
          addOrUpdateChange("docType", undefined);
        }
        return;
      }

      // 3) Document Type (docType)
      if (field === "docType") {
        data.docType = newValue;
        params.api.applyTransaction({ update: [data] });

        const origValue = originalRow.docType || "";
        if (data.docType !== origValue) {
          addOrUpdateChange("docType", data.docType);
        } else {
          addOrUpdateChange("docType", undefined);
        }
        return;
      }

      // 4) Report Effective Date
      if (field === "reportEffectiveDate") {
        if (newValue instanceof Date) {
          data.reportEffectiveDate = newValue.toISOString();
        } else if (typeof newValue === "string" && newValue) {
          if (!newValue.includes("T") || !newValue.endsWith("Z")) {
            const dateObj = new Date(newValue);
            if (!isNaN(dateObj.getTime())) {
              data.reportEffectiveDate = dateObj.toISOString();
            }
          }
        }
        params.api.applyTransaction({ update: [data] });

        const origValue = originalRow.reportEffectiveDate || "";
        if (data.reportEffectiveDate !== origValue) {
          addOrUpdateChange("reportEffectiveDate", data.reportEffectiveDate);
        } else {
          addOrUpdateChange("reportEffectiveDate", undefined);
        }
        return;
      }

      // 5) Report Guideline Expiration Days
      if (field === "reportGuidelineExpirationDays") {
        data.reportGuidelineExpirationDays = newValue;
        params.api.applyTransaction({ update: [data] });

        const origValue = originalRow.reportGuidelineExpirationDays;
        if (data.reportGuidelineExpirationDays !== origValue) {
          addOrUpdateChange(
            "reportGuidelineExpirationDays",
            data.reportGuidelineExpirationDays
          );
        } else {
          addOrUpdateChange("reportGuidelineExpirationDays", undefined);
        }
        return;
      }

      // 6) Exclude From Export (boolean)
      if (field === "excludeFromExport") {
        data.excludeFromExport = newValue;
        params.api.applyTransaction({ update: [data] });

        const origValue = originalRow.excludeFromExport || false;
        if (data.excludeFromExport !== origValue) {
          addOrUpdateChange("excludeFromExport", data.excludeFromExport);
        } else {
          addOrUpdateChange("excludeFromExport", false);
        }
        return;
      }

      // 7) Approved For Third Party (boolean)
      if (field === "approvedForThirdParty") {
        data.approvedForThirdParty = newValue;
        params.api.applyTransaction({ update: [data] });

        const origValue = originalRow.approvedForThirdParty || false;
        if (data.approvedForThirdParty !== origValue) {
          addOrUpdateChange(
            "approvedForThirdParty",
            data.approvedForThirdParty
          );
        } else {
          addOrUpdateChange("approvedForThirdParty", false);
        }
        return;
      }

      // 8) Hidden (isHidden boolean)
      if (field === "isHidden") {
        data.isHidden = newValue;
        params.api.applyTransaction({ update: [data] });

        const origValue = originalRow.isHidden || false;
        if (data.isHidden !== origValue) {
          addOrUpdateChange("isHidden", data.isHidden);
        } else {
          addOrUpdateChange("isHidden", false);
        }
        return;
      }

      // 9) Final (isFinal boolean)
      if (field === "isFinal") {
        data.isFinal = newValue;
        params.api.applyTransaction({ update: [data] });

        const origValue = originalRow.isFinal || false;
        if (data.isFinal !== origValue) {
          addOrUpdateChange("isFinal", data.isFinal);
        } else {
          addOrUpdateChange("isFinal", false);
        }
        return;
      }
    },
    [originalRowData, setChangedRows]
  );
};
