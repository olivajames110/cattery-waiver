import { ModuleRegistry } from "ag-grid-community";
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MultiFilterModule,
  PivotModule,
  RowGroupingModule,
  RowGroupingPanelModule,
  SetFilterModule,
  SideBarModule,
  TreeDataModule,
} from "ag-grid-enterprise";
import { AgGridReact } from "ag-grid-react";
import React, { forwardRef, useCallback, useMemo, useState } from "react";

import {
  fileDocGroups,
  getDocTypesByGroup,
} from "../../../../config/fileDocGroupAndTypes";
import { sideBarColumnsFilters } from "../../../../utils/agGrid/sideBar/sideBarColumnsFilters";

import {
  AddCommentOutlined,
  CommentOutlined,
  DownloadOutlined,
  OpenInNewOutlined,
  PersonOutline,
  PreviewOutlined,
  StoreOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import { Chip, IconButton, Tooltip } from "@mui/material";
import { amber, blue, green } from "@mui/material/colors";
import AgGridTableWrapper from "../../../../components/agGrid/AgGridTableWrapper";
import Flx from "../../../../components/layout/Flx";
import { useLoanFilesHook } from "../../../../hooks/useLoanFilesHook";
import { columnTypesBoolean } from "../../../../utils/agGrid/columnTypes/columnTypesBoolean";
import { isArray, isEmpty, size } from "lodash";
import { useSelector } from "react-redux";

ModuleRegistry.registerModules([
  SideBarModule,
  RowGroupingPanelModule,
  MultiFilterModule,
  RowGroupingModule,
  PivotModule,
  TreeDataModule,
  FiltersToolPanelModule,
  ColumnsToolPanelModule,
  SetFilterModule,
]);

const LoanFileManagerTable = forwardRef(
  (
    {
      rowData,
      editing,
      onCellValueChanged,
      quickFilterText,
      setPreview,
      enhancedDetails,
      height = "100%",
      gridOptions,
    },
    ref
  ) => {
    const activePreviewFile = useSelector((state) => state.sidebar?.state);
    const columnDefs = useMemo(() => {
      return [
        {
          field: "_id",
          headerName: "ID",
          hide: true,
        },
        {
          width: 150,
          maxWidth: 150,
          flex: 0,
          headerName: "Actions",
          resizable: false,
          cellStyle: {
            display: "flex",
            alignItems: "center",
            paddingLeft: "7px",
          },
          cellRenderer: (params) => {
            if (params.node.group) {
              return params.value;
            }
            return (
              <LoanFileActions onPreviewClick={setPreview} params={params} />
            );
          },
        },
        {
          field: "file_display_name",
          headerName: "File Name",
          sortable: true,
          filter: true,
          resizable: true,
          editable: editing,
          flex: 1,
          minWidth: 250,
        },
        {
          field: "docGroup",
          headerName: "File Group Category",
          sortable: true,
          filter: true,
          resizable: true,
          editable: (params) => editing,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: { values: fileDocGroups },
          flex: 1,
          maxWidth: 400,
          sort: "asc",
          minWidth: 200,
          // minWidth: 245,
          // If groupDocs is true, we actually group by docGroup,
          // hide the column, and use showRowGroup to display it in the group column
          // rowGroup: groupDocs,
          // hide: groupDocs,
          showRowGroup: "docGroup",

          onCellValueChanged: (params) => {
            // If docGroup changes, reset docType
            if (params.oldValue !== params.newValue) {
              params.data.docType = null;
              params.api.refreshCells({
                rowNodes: [params.node],
                columns: ["docType"],
                force: true,
              });
            }
          },
        },
        {
          field: "docType",
          headerName: "Category Type",
          sortable: true,
          filter: true,
          resizable: true,
          sort: "asc",
          flex: 1,
          minWidth: 200,
          maxWidth: 400,

          // minWidth: 265,
          editable: (params) => editing,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: (params) => {
            const docGroup = params.data.docGroup;
            return {
              values: getDocTypesByGroup(docGroup),
            };
          },
        },

        // {
        //   headerName: "Comments",
        //   field: "associations.commentIds",
        //   width: 110,
        //   valueFormatter: (params) => {
        //     return size(params.value) || 0;
        //   },
        // },
        // {
        //   headerName: "Associations",
        //   field: "associations",
        //   // minwidth: 150,
        //   flexGrow: 1,
        //   flexShrink: 0,

        //   cellRenderer: (params) => (
        //     <FileAssociationsCellRenderer params={params} />
        //   ),
        // },
        {
          field: "uploadDate",
          headerName: "Upload Date",
          sortable: true,
          filter: true,
          resizable: true,
          hide: !enhancedDetails,
          // Hide the upload date in a group row:
          cellRenderer: (params) => {
            if (params.node.group) {
              return "";
            }
            return new Date(params.value).toLocaleString();
          },
          width: 180,
        },
        {
          field: "uploadedBy",
          headerName: "Uploaded By",
          sortable: true,
          filter: true,
          resizable: true,
          hide: !enhancedDetails,
          width: 180,
        },
        {
          field: "isHidden",
          headerName: "Hidden",
          sortable: true,
          filter: true,
          resizable: true,
          editable: () => editing,
          width: 90,
          hide: !enhancedDetails,
          cellRenderer: "agCheckboxCellRenderer",
          cellEditor: "agCheckboxCellEditor",
        },
        {
          field: "isFinal",
          headerName: "Final",
          sortable: true,
          filter: true,
          resizable: true,
          editable: () => editing,
          width: 90,
          cellRenderer: "agCheckboxCellRenderer",
          cellEditor: "agCheckboxCellEditor",
        },
        {
          field: "updatedBy",
          headerName: "Updated By",
          sortable: true,
          filter: true,
          resizable: true,
          hide: !enhancedDetails,
          width: 180,
        },
        {
          field: "modifiedDate",
          headerName: "Modified Date",
          sortable: true,
          filter: true,
          resizable: true,
          valueFormatter: (params) => new Date(params.value).toLocaleString(),
          width: 180,
          hide: !enhancedDetails,
        },
        {
          field: "excludeFromExport",
          headerName: "Exclude From Export",
          sortable: true,
          filter: true,
          resizable: true,
          hide: !enhancedDetails,
          editable: (params) => editing,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: { values: [true, false, null] },
          valueFormatter: (params) => {
            if (params.value === true) return "Yes";
            if (params.value === false) return "No";
            return "Not Set";
          },
          width: 165,
        },
        {
          field: "approvedForThirdParty",
          headerName: "Approved For Third Party",
          sortable: true,
          filter: true,
          resizable: true,
          hide: !enhancedDetails,
          width: 195,
          editable: (params) => editing,
          cellEditor: "agSelectCellEditor",
          cellEditorParams: { values: [true, false, null] },
          valueFormatter: (params) => {
            if (params.value === true) return "Yes";
            if (params.value === false) return "No";
            return "Not Set";
          },
        },
        {
          field: "file_name_as_loaded",
          headerName: "Original File Name",
          sortable: true,
          filter: true,
          resizable: true,
          hide: true,
        },
        {
          field: "content_type",
          headerName: "Content Type",
          sortable: true,
          filter: true,
          resizable: true,
          hide: !enhancedDetails,
          width: 150,
        },
        {
          field: "size",
          headerName: "Size",
          sortable: true,
          filter: true,
          resizable: true,
          hide: !enhancedDetails,
          // Hide the size in a group row:
          cellRenderer: (params) => {
            if (params.node.group) {
              return "";
            }
            const mb = (params.value || 0) / 1024 / 1024;
            return mb.toFixed(2) + " MB";
          },
          width: 120,
        },
      ];
    }, [editing, setPreview, enhancedDetails]);

    // Default column definition
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

    // Row style highlighting logic
    const getRowStyle = useCallback(
      (params) => {
        if (params?.data?._id === activePreviewFile?._id) {
          return {
            // background: "#faf0893d",
            background: blue[50],
            borderLeft: `4px solid ${blue[200]}`,
          };
        }
        if (params?.data?.isHidden) {
          return {
            // background: "#faf0893d",
            background: amber[50],
            borderLeft: `4px solid ${amber[200]}`,
          };
        }
        if (params?.data?.isFinal) {
          return {
            borderLeft: `4px solid ${green[500]}`,
            // borderLeft: "4px solid #569a3d",
            background: "#f9fef7",
          };
        }
        return { borderLeft: "3px solid transparent" };
      },
      [activePreviewFile]
    );

    const autoGroupColumnDef = useMemo(
      () => ({
        field: "docGroup",
        headerName: "Document Group",
        minWidth: 220,
        cellRendererParams: {
          suppressCount: true, // e.g. hide the "(3)" group count if you want
        },
        comparator: (valueA, valueB) => {
          if (valueA < valueB) return -1;
          if (valueA > valueB) return 1;
          return 0;
        },
      }),
      []
    );

    const onRowClicked = useCallback((params) => {
      if (params.node.group) {
        params.node.setExpanded(!params.node.expanded);
      }
    }, []);

    const onCellClicked = useCallback(
      (params) => {
        // console.log("params", params
        if (editing || params.colDef.headerName === "Actions") {
          return;
        }

        setPreview(params.data);
      },
      [editing]
    );

    const sideBar = useMemo(() => sideBarColumnsFilters(), []);

    const rowSelection = useMemo(() => {
      if (editing) {
        return {
          mode: "multiRow",
        };
      }
      return {};
    }, [editing]);

    const columnTypes = useMemo(() => {
      return {
        ...columnTypesBoolean(),
      };
    }, []);

    const isExternalFilterPresent = () => true;

    const doesExternalFilterPass = (node) => {
      if (editing) return true;
      return node.data.isHidden !== true;
    };
    const onGridReady = useCallback(
      (params) => {
        // if (!enhancedDetails) {
        //   return;
        // }
        if (params?.api) {
          params.api.sizeColumnsToFit();
          // params?.api?.autoSizeAllColumns();
        }
      },
      [enhancedDetails]
    );
    return (
      <AgGridTableWrapper
        height={height}
        suppressBorder
        suppressBorderRadius
        size={4}
        // sx={{ minHeight: "700px" }}
      >
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          // quickFilterText={quickFilterText}
          getRowStyle={getRowStyle}
          onGridReady={onGridReady}
          autoGroupColumnDef={autoGroupColumnDef}
          // pagination
          onCellClicked={onCellClicked}
          stopEditingWhenCellsLoseFocus
          // isExternalFilterPresent={isExternalFilterPresent}
          // doesExternalFilterPass={doesExternalFilterPass}
          singleClickEdit={editing}
          columnTypes={columnTypes}
          sideBar={sideBar}
          tooltipShowDelay={0}
          tooltipInteraction={true}
          onCellValueChanged={onCellValueChanged}
          // domLayout={"autoHeight"}
          domLayout={size(rowData) < 8 ? "normal" : "autoHeight"}
          tooltipMouseTrack
          groupDisplayType={"groupRows"}
          allowDragFromColumnsToolPanel={false}
          gridOptions={gridOptions}
          rowGroupPanelShow={"always"}
          enableCellTextSelection
          onRowClicked={onRowClicked}
          rowSelection={rowSelection}
        />
      </AgGridTableWrapper>
    );
  }
);

const LoanFileActions = ({ onPreviewClick, params }) => {
  const { loading, getFileById } = useLoanFilesHook();
  const [externalDownloadLoading, setExternalDownloadLoading] = useState(null);

  const onDownloadClick = () => {
    getFileById({
      loanId: params?.data?.dealId,
      file_storage_name: params?.data?.file_storage_name,
      fileDownloadName: params?.data?.file_display_name,
      fileDownload: true,
    });
  };

  const handleOnExternalDownloadClick = useCallback(
    (params) => {
      setExternalDownloadLoading(true);
      getFileById({
        loanId: params?.data?.dealId,
        file_storage_name: params?.data?.file_storage_name,
        fileDownloadName: params?.data?.file_display_name,
        openInNewTab: true,
        onSuccessFn: () => {
          setExternalDownloadLoading(false);
        },
      });
    },
    [getFileById, setExternalDownloadLoading]
  );

  const handleOnPreviewClick = useCallback(
    (params) => {
      onPreviewClick(params?.data);
    },
    [onPreviewClick]
  );
  return (
    <Flx
      ac
      sx={{
        ".MuiButtonBase-root": {
          borderRadius: "0",
          width: "32px",
          // width: "36px",
          height: "30px",
          p: 0,
          pt: 0.3,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tooltip title="Open In New Tab">
        <IconButton
          loading={externalDownloadLoading}
          onClick={() => handleOnExternalDownloadClick(params)}
          size="small"
          color="primary"
        >
          <OpenInNewOutlined className="thin-6" sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Download">
        <IconButton
          loading={loading && !externalDownloadLoading}
          onClick={onDownloadClick}
          size="small"
          color="primary"
        >
          <DownloadOutlined className="thin-7" sx={{ fontSize: 20 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add Comment">
        <IconButton
          loading={externalDownloadLoading}
          onClick={() => handleOnExternalDownloadClick(params)}
          size="small"
          color="primary"
        >
          <AddCommentOutlined className="thin-2" sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>
      <Tooltip title="Preview">
        <IconButton
          onClick={() => handleOnPreviewClick(params)}
          size="small"
          color="primary"
        >
          {/* <PreviewOutlined className="thin-10" sx={{ fontSize: 20 }} /> */}
          <VisibilityOutlined className="thin-5" sx={{ fontSize: 18 }} />
        </IconButton>
      </Tooltip>
    </Flx>
  );
};
const FileAssociationsCellRenderer = ({ params }) => {
  // console.log("FileAssociationsCellRenderer", params);
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  let val = [];

  const associations = params?.value;
  if (!isArray(associations) || isEmpty(associations)) {
    return;
  }
  // if (!isEmpty(params?.value?.borrowerIds)) {
  //   // val.push(`Borrowers (${size(params?.value?.borrowerIds)})`);
  //   params?.value?.borrowerIds?.forEach((item) => {
  //     const bor = loanDrilldown?.borrowers?.find(
  //       (b) => b._id === item || b.id === item
  //     );
  //     val.push(
  //       <Chip
  //         sx={{ mr: 0.5 }}
  //         icon={<PersonOutline />}
  //         label={`${bor?.firstName || ""} ${bor?.lastName || ""}`}
  //         size="small"
  //       />
  //     );
  //   });
  // }
  // const properties = params?.value?.filter(
  //   (f) => f?.associationType === "comment"
  // );
  // if (!isEmpty(params?.value?.propertyIds)) {
  //   params?.value?.propertyIds?.forEach((item) => {
  //     const prop = loanDrilldown?.subjectProperties?.find(
  //       (b) => b._id === item || b.id === item
  //     );

  //     val.push(
  //       <Chip
  //         sx={{ mr: 0.5 }}
  //         icon={<StoreOutlined />}
  //         label={`${prop?.address?.fullAddress || ""}`}
  //         size="small"
  //       />
  //     );
  //   });
  // }

  const borrowers = associations?.filter((f) => f?.entityType === "borrowers");
  // console.log("-------borrowers", borrowers);
  if (!isEmpty(borrowers)) {
    borrowers?.forEach((item) => {
      const bor = loanDrilldown?.borrowers?.find(
        (b) => b._id === item?.entityId
      );
      val.push(
        <Chip
          sx={{ mr: 0.5 }}
          icon={<PersonOutline />}
          label={`${bor?.firstName || ""} ${bor?.lastName || ""}`}
          size="small"
        />
      );
    });
  }

  const comments = associations?.filter((f) => f?.entityType === "comments");
  if (!isEmpty(comments)) {
    val.push(
      <Chip
        sx={{ mr: 0.5 }}
        icon={<CommentOutlined className="thin" />}
        label={`Comments (${size(comments)})`}
        size="small"
      />
    );
  }

  return val;
};
export default LoanFileManagerTable;
