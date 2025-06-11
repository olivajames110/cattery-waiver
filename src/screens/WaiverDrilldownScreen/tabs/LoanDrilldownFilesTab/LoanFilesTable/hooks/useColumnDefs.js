// src/components/LoanFilesTable/hooks/useColumnDefs.js
import { useMemo } from "react";
import CellRendererLoanFileActions from "../CellRendererLoanFileActions";
import {
  fileDocGroups,
  getDocTypesByGroup,
} from "../../../../../../config/fileDocGroupAndTypes";
import { isBoolean, isNil, isNumber, isString, toNumber } from "lodash";

/**
 * Builds the array of column definitions. Depends on `groupByCategory` and `editing`.
 */
export const useColumnDefs = (groupByCategory, editing) => {
  return useMemo(
    () => [
      {
        width: 120,
        maxWidth: 120,
        // width: 150,
        // maxWidth: 150,
        flex: 0,
        headerName: "Actions",
        resizable: false,
        hide: editing,
        cellStyle: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingLeft: "7px",
        },
        cellRenderer: (params) => {
          if (params.node.group) {
            return params.value;
          }
          return <CellRendererLoanFileActions params={params} />;
        },
      },
      {
        headerName: "Filename",
        field: "file_display_name",
        flex: 1,
        minWidth: 250,
        cellEditor: "agTextCellEditor",
        editable: editing,
      },
      {
        headerName: "Category",
        field: "docGroup",
        rowGroup: groupByCategory,
        sort: "asc",
        showRowGroup: "docGroup",
        minWidth: 220,
        editable: editing,
        cellEditor: "agRichSelectCellEditor",
        cellEditorPopup: true,
        cellEditorParams: {
          values: fileDocGroups || [],
        },
      },
      {
        headerName: "Document Type",
        field: "docType",
        sort: "asc",
        editable: editing,
        minWidth: 220,
        cellEditor: "agRichSelectCellEditor",
        cellEditorPopup: true,
        cellEditorParams: (params) => {
          return {
            values: getDocTypesByGroup(params.data.docGroup),
          };
        },
      },
      {
        headerName: "Report Effective Date",
        field: "reportEffectiveDate",
        type: "date",
        width: 140,
        editable: editing,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
      },
      {
        headerName: "Report Guideline Expiration Days",
        field: "reportGuidelineExpirationDays",
        type: "number",
        editable: editing,
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 140,
        valueFormatter: (params) => {
          // console.log("params", params);
          const value = params.value;

          if (isNil(value)) {
            return; // Default to 0 if the value is not a number
          }
          if (isNumber(value)) {
            return value; // Default to 0 if the value is not a number
          }
          if (isString(value)) {
            const convertedValue = toNumber(value);
            if (isNumber(convertedValue)) {
              return convertedValue;
            }
          }
          return;
        },
      },
      {
        field: "excludeFromExport",
        headerName: "Exclude File From Export",
        sortable: true,
        filter: true,
        resizable: true,
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 140,
        editable: editing,
        cellRenderer: "agCheckboxCellRenderer",
        cellEditor: "agCheckboxCellEditor",
        valueGetter: (params) => {
          if (isBoolean(params?.data?.excludeFromExport)) {
            return params?.data?.excludeFromExport;
          }
          if (isString(params?.data?.excludeFromExport)) {
            if (
              params?.data?.excludeFromExport === "true" ||
              params?.data?.excludeFromExport === "True"
            ) {
              return true;
            }
            if (
              params?.data?.excludeFromExport === "false" ||
              params?.data?.excludeFromExport === "False"
            ) {
              return false;
            }
          }

          return false;
        },
      },
      {
        field: "approvedForThirdParty",
        headerName: "File Approved For Third Party",
        sortable: true,
        filter: true,
        resizable: true,
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 140,
        cellRenderer: "agCheckboxCellRenderer",
        cellEditor: "agCheckboxCellEditor",

        editable: editing,
        valueGetter: (params) => {
          if (isBoolean(params?.data?.approvedForThirdParty)) {
            return params?.data?.approvedForThirdParty;
          }
          if (isString(params?.data?.approvedForThirdParty)) {
            if (
              params?.data?.approvedForThirdParty === "true" ||
              params?.data?.approvedForThirdParty === "True"
            ) {
              return true;
            }
            if (
              params?.data?.approvedForThirdParty === "false" ||
              params?.data?.approvedForThirdParty === "False"
            ) {
              return false;
            }
          }

          return false;
        },
      },
      {
        field: "isFinal",
        headerName: "Is Final",
        sortable: true,
        hide: !editing,
        filter: true,
        resizable: true,
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 140,
        editable: editing,
        cellRenderer: "agCheckboxCellRenderer",
        cellEditor: "agCheckboxCellEditor",
        valueGetter: (params) => {
          const name = "isFinal";
          if (isBoolean(params?.data?.[name])) {
            return params?.data?.[name];
          }
          if (isString(params?.data?.[name])) {
            if (
              params?.data?.[name] === "true" ||
              params?.data?.[name] === "True"
            ) {
              return true;
            }
            if (
              params?.data?.[name] === "false" ||
              params?.data?.[name] === "False"
            ) {
              return false;
            }
          }

          return false;
        },
      },
      {
        field: "isHidden",
        headerName: "Is Hidden",
        sortable: true,
        hide: !editing,
        filter: true,
        resizable: true,
        suppressHeaderFilterButton: true,
        suppressHeaderMenuButton: true,
        wrapHeaderText: true,
        autoHeaderHeight: true,
        width: 140,
        editable: editing,
        cellRenderer: "agCheckboxCellRenderer",
        cellEditor: "agCheckboxCellEditor",
        valueGetter: (params) => {
          const name = "isHidden";
          if (isBoolean(params?.data?.[name])) {
            return params?.data?.[name];
          }
          if (isString(params?.data?.[name])) {
            if (
              params?.data?.[name] === "true" ||
              params?.data?.[name] === "True"
            ) {
              return true;
            }
            if (
              params?.data?.[name] === "false" ||
              params?.data?.[name] === "False"
            ) {
              return false;
            }
          }

          return false;
        },
      },
    ],
    [groupByCategory, editing]
  );
};
