import { AgGridReact } from "ag-grid-react";
import { forwardRef, useCallback, useMemo, useState } from "react";

// import AgGridTableWrapper from "../../../assets/AgGridTableWrapper";
import { grey, yellow } from "@mui/material/colors";
import { AgChartsEnterpriseModule } from "ag-charts-enterprise";
import { ModuleRegistry } from "ag-grid-community";
import {
  ClipboardModule,
  ContextMenuModule,
  IntegratedChartsModule,
} from "ag-grid-enterprise";
import { isBoolean, isEmpty, isNil, isNumber, isString, size } from "lodash";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import AgGridTableWrapper from "../../components/agGrid/AgGridTableWrapper";
// import OpenInNewTabButton from "../components/buttons/OpenInNewTabButton";
import { ChatBubbleOutline, EditOutlined } from "@mui/icons-material";
import { Badge, IconButton, Tooltip } from "@mui/material";
import CommentItemRenderer from "../../_src_shared/comments/CommentItemRenderer";
import LoanCommentTextBox from "../../components/common/Loan/LoanCommentTextBox";
import SideCardModal from "../../components/modals/SideCardModal";
import OpenInNewTabButton from "../../components/ui/buttons/OpenInNewTabButton";
import { colDefFilterMultiSelect } from "../../utils/agGrid/colDefs/colDefFilterMultiSelect";
import { columnTypesBoolean } from "../../utils/agGrid/columnTypes/columnTypesBoolean";
import { columnTypesDate } from "../../utils/agGrid/columnTypes/columnTypesDate";
import { columnTypesDollar } from "../../utils/agGrid/columnTypes/columnTypesDollar";
import { columnTypesPercent } from "../../utils/agGrid/columnTypes/columnTypesPercent";
import { sideBarColumnsFilters } from "../../utils/agGrid/sideBar/sideBarColumnsFilters";
import { aggFuncsDefault } from "../../_src_shared/utils/agGrid/aggFuncs/aggFuncsDefault";

ModuleRegistry.registerModules([
  IntegratedChartsModule.with(AgChartsEnterpriseModule),
  ContextMenuModule,
  ClipboardModule,
]);

const CellRendererEditableField = (params) => {
  return (
    <>
      {params?.valueFormatted || params?.value}
      <EditOutlined sx={{ fontSize: "16px", ml: 0.5 }} className="thin-9" />
    </>
  );
};

const CellRendererLoanName = (params) => {
  const navigate = useNavigate();
  const onLoanClick = () => {
    navigate(`/loan/${params?.data?.loanNumber}`);
  };
  return (
    <>
      <span
        onClick={onLoanClick}
        role="button"
        style={{
          cursor: "pointer",
          borderBottom: "1px solid black",
        }}
      >
        {params?.valueFormatted || params?.value}{" "}
      </span>
      <LoanCommentsBadge loan={params?.data} />
    </>
  );
};

const LoanCommentsBadge = ({ loan }) => {
  const [show, setShow] = useState(false);

  if (isEmpty(loan?.comments)) {
    return null;
  }
  return (
    <>
      <Tooltip title="View Comments">
        <IconButton
          onClick={() => setShow(true)}
          size="small"
          sx={{ ml: 0.5, mt: 0.3 }}
        >
          <Badge
            sx={{
              ".MuiBadge-badge": {
                fontSize: "9px",
                height: "16px",
                minWidth: "16px",
                p: 0,
              },
            }}
            badgeContent={size(loan?.comments)}
            color="primary"
          >
            <ChatBubbleOutline color="primary" className="thin" />
          </Badge>
        </IconButton>
      </Tooltip>
      <LoanCommentsSideCardPreview
        show={show}
        onClose={setShow}
        loan={loan}
        comments={loan?.comments}
      />
    </>
  );
};

const LoanCommentsSideCardPreview = ({ show, onClose, loan, comments }) => {
  return (
    <SideCardModal
      title={"Loan Comments"}
      show={show}
      onClose={onClose}
      suppressBodyPadding
      bodySx={{ pt: 1.5 }}
    >
      <LoanCommentTextBox loan={loan} />
      <CommentItemRenderer px={2} comments={comments} />
    </SideCardModal>
  );
};

const WaiverSearchTable = forwardRef(
  (
    {
      rowData,
      loading,
      quickFilterText,
      onStateUpdated,
      onLoanSelect,
      height = "100%",
    },
    ref
  ) => {
    const navigate = useNavigate();
    const sideBar = useMemo(() => sideBarColumnsFilters(), []);
    const aggFuncs = useMemo(() => aggFuncsDefault(), []);
    // -------------------------------------
    // Columns
    // -------------------------------------
    const columnDefs = useMemo(
      () => [
        { hide: true, headerName: "_id", field: "_id" },
        {
          headerName: "Loan Number",
          field: "loanNumber",
          minWidth: 120,
          width: 120,
          suppressAutoSize: true,
          flex: 0,
          filter: "agTextColumnFilter",

          cellRenderer: (params) => (
            <OpenInNewTabButton
              linkIcon
              to={`/loan/${params?.data?.loanNumber}`}
            >
              {params?.data?.loanNumber}
            </OpenInNewTabButton>
          ),
        },
        {
          headerName: "Loan Name",
          field: "loanName",
          minWidth: 200,
          cellStyle: {
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          },
          cellRenderer: CellRendererLoanName,
          valueGetter: (params) =>
            isNil(params?.data?.loanName)
              ? `Loan #${params?.data?.loanNumber}`
              : params?.data?.loanName,
        },

        {
          headerName: "Loan Name",
          field: "id",
        },
        {
          headerName: "Loan Name",
          field: "type",
        },
        {
          headerName: "Loan Name",
          field: "firstName",
        },
        {
          headerName: "Loan Name",
          field: "lastName",
        },
        {
          headerName: "Loan Name",
          field: "fullName",
        },
        {
          headerName: "Loan Name",
          field: "dateOfBirth",
        },
        {
          headerName: "Loan Name",
          field: "signature",
        },
        {
          headerName: "Loan Name",
          field: "isSigningAdult",
        },
        {
          headerName: "Loan Name",
          field: "minorsSignedFor",
        },
      ],
      []
    );

    const defaultColDef = useMemo(() => {
      const isEmptyValue = (p) => {
        return isNil(p?.value) || (isString(p?.value) && p?.value === "None");
      };
      return {
        enableRowGroup: true,
        enablePivot: true,
        enableValue: true,
        floatingFilter: true,
        filter: colDefFilterMultiSelect,
        showRowGroup: false,
        valueFormatter: (p) => {
          if (isEmptyValue(p)) {
            return "-";
          }
        },
        cellStyle: (p) => {
          if (isBoolean(p?.value) || isNumber(p?.value)) {
            return;
          }
          if (isEmptyValue(p)) {
            return {
              opacity: 0.4,
            };
          }
        },
        // filter: colDefFilterText,
      };
    }, []);

    const columnTypes = useMemo(() => {
      return {
        ...columnTypesDate(),
        ...columnTypesPercent(),
        ...columnTypesDollar(),
        ...columnTypesBoolean(),
      };
    }, []);

    // -------------------------------------
    // Table Functionality
    // -------------------------------------

    const onCellClicked = useCallback(
      (params) => {
        // console.log("onCellClicked", params);
        if (
          isNil(params?.colDef?.field === "loanNumber") ||
          params?.colDef?.field === "loanName"
        ) {
          return;
        }
        if (
          params?.colDef?.field === "loanStatus" ||
          params?.colDef?.field === "expectedClosingDate" ||
          params?.colDef?.field === "baseLoanAmount"
        ) {
          onLoanSelect(params?.data, params?.colDef?.field);
          return;
        }
        if (isNil(params?.data?.loanNumber)) {
          console.warn("No loan _id found");
          return;
        }
        // navigate(`/loan/${params?.data?.loanNumber}`);
      },
      [onLoanSelect]
    );

    const onFirstDataRendered = useCallback((params) => {
      // this will size each column to fit its content (including header)
      params?.api?.autoSizeAllColumns();

      // if you also want them to stretch to fill the grid width:
      // params.api.sizeColumnsToFit();
    }, []);

    const onGridReady = useCallback((params) => {
      if (params?.api) {
        params?.api?.autoSizeAllColumns();
      }
    }, []);

    return (
      <AgGridTableWrapper
        height={height}
        size={4}
        sx={{
          ".yellow-header": {
            background: yellow[200],
          },
        }}
      >
        <AgGridReact
          ref={ref}
          rowData={rowData}
          columnDefs={columnDefs}
          quickFilterText={quickFilterText}
          defaultColDef={defaultColDef}
          onGridReady={onGridReady}
          loading={loading}
          // Local
          onFirstDataRendered={onFirstDataRendered}
          groupDisplayType={"groupRows"}
          onCellClicked={onCellClicked}
          columnTypes={columnTypes}
          rowGroupPanelShow={"always"}
          sideBar={sideBar}
          onStateUpdated={onStateUpdated}
          // ---From reporting

          // pivotRowTotals={"after"}
          // grandTotalRow={"bottom"}
          // Charts
          cellSelection={true}
          enableCharts={true}
          //Global Defaults
          aggFuncs={aggFuncs}
          suppressAggFuncInHeader={true}
        />
      </AgGridTableWrapper>
    );
    // return (
    //   <AgGridTableWrapper
    //     height={height}
    //     size={4}
    //     sx={{
    //       ".yellow-header": {
    //         background: yellow[200],
    //       },
    //     }}
    //   >
    //     <AgGridReact
    //       ref={ref}
    //       rowData={rowData}
    //       columnDefs={columnDefs}
    //       quickFilterText={quickFilterText}
    //       defaultColDef={defaultColDef}
    //       onGridReady={onGridReady}
    //       // Local
    //       onFirstDataRendered={onFirstDataRendered}
    //       groupDisplayType={"groupRows"}
    //       onCellClicked={onCellClicked}
    //       columnTypes={columnTypes}
    //       rowGroupPanelShow={"always"}
    //       sideBar={sideBar}
    //       onStateUpdated={onStateUpdated}
    //       enableCharts={true}
    //     />
    //   </AgGridTableWrapper>
    // );
  }
);

export default WaiverSearchTable;
