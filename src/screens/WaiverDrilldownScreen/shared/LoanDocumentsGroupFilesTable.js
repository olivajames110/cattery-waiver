import React, { useCallback, useMemo, useRef } from "react";
import { useDispatch } from "react-redux";
import { sidebarSetValues } from "../../../redux/actions/sidebarActions";
import { columnTypesBoolean } from "../../../_src_shared/utils/agGrid/columnTypes/columnTypesBoolean";
import AgGridTableWrapper from "../../../components/agGrid/AgGridTableWrapper";
import { AgGridReact } from "ag-grid-react";
import { agApiSizeColumnsToFit } from "../../../_src_shared/utils/agGrid/api/agApiSizeColumnsToFit";

const LoanDocumentsGroupFilesTable = ({ quickFilter, loanDocuments }) => {
  const ref = useRef();
  const dispatch = useDispatch();
  const rowData = useMemo(() => loanDocuments, [loanDocuments]);

  const columnDefs = useMemo(
    () => [
      {
        headerName: "Name",
        field: "file_display_name",

        flex: 1,
      },
      {
        headerName: "Document Type",
        field: "docType",
        sort: "asc",
      },
    ],
    []
  );

  const defaultColDef = useMemo(
    () => ({
      filter: true,
      enableRowGroup: true,
      enablePivot: true,
      suppressHeaderFilterButton: true,
      suppressHeaderMenuButton: true,
      headerCheckboxSelectionFilteredOnly: true,
      menuTabs: ["filterMenuTab"],
    }),
    []
  );

  const onRowClicked = useCallback((params) => {
    const file = params?.data;
    dispatch(
      sidebarSetValues({
        type: "filePreview",
        state: file,
      })
    );
  }, []);

  const columnTypes = useMemo(() => {
    return {
      // ...columnTypesDate(),
      // ...columnTypesDollar(),
      ...columnTypesBoolean(),
    };
  }, []);

  const onFirstDataRendered = useCallback((params) => {
    agApiSizeColumnsToFit(params);
  }, []);

  return (
    <AgGridTableWrapper simpleTable suppressMinHeightWhenPopulated={rowData}>
      <AgGridReact
        ref={ref}
        rowData={rowData}
        columnDefs={columnDefs}
        quickFilterText={quickFilter}
        defaultColDef={defaultColDef}
        columnTypes={columnTypes}
        onFirstDataRendered={onFirstDataRendered}
        onRowClicked={onRowClicked}
        allowDragFromColumnsToolPanel={false}
        domLayout={"autoHeight"}
        enableCellTextSelection
      />
    </AgGridTableWrapper>
  );
};

export default LoanDocumentsGroupFilesTable;
