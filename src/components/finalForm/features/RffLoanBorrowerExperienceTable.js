import React, { useCallback, useEffect, useMemo, useState } from "react";
import RffInputWrapper from "../shared/RffInputWrapper";
import AgGridTableWrapper from "../../agGrid/AgGridTableWrapper";
import { AgGridReact } from "ag-grid-react";
import { useForm } from "react-final-form";

function getIn(obj, path) {
  if (!obj) return undefined;
  const segments = path.split(".");
  let current = obj;
  for (const segment of segments) {
    if (current == null) return undefined;
    const bracketMatch = segment.match(/^([^\[]+)\[(\d+)\]$/);
    if (bracketMatch) {
      const [_, arrayKey, idx] = bracketMatch;
      current = current[arrayKey];
      if (!Array.isArray(current) || current[+idx] === undefined)
        return undefined;
      current = current[+idx];
    } else {
      current = current[segment];
    }
  }
  return current;
}

function buildPath(prefix, rowName, columnField) {
  return prefix
    ? `${prefix}.${rowName}.${columnField}`
    : `${rowName}.${columnField}`;
}

const RffLoanBorrowerExperienceTable = ({ name, label }) => {
  const form = useForm();

  const initialRowData = [
    {
      description: "Property fix and flips completed and sold",
      last_two_years: 0,
      two_to_four_years: 0,
      greater_than_four_years: 0,
      name: "ff_sold",
    },
    {
      description: "Property rehabs completed and retained as rental",
      last_two_years: 0,
      two_to_four_years: 0,
      greater_than_four_years: 0,
      name: "ff_retained_as_rental",
    },
    {
      description: "Income Producing Properties acquired",
      last_two_years: 0,
      two_to_four_years: 0,
      greater_than_four_years: 0,
      name: "income_producing_properties",
    },
    {
      description: "Ground up construction - completed and sold",
      last_two_years: 0,
      two_to_four_years: 0,
      greater_than_four_years: 0,
      name: "guc_sold",
    },
    {
      description: "Ground up construction and retained as rental",
      last_two_years: 0,
      two_to_four_years: 0,
      greater_than_four_years: 0,
      name: "guc_retained_as_rental",
    },
    {
      description:
        "Property rehab completed and sold as GC for 3rd party investor",
      last_two_years: 0,
      two_to_four_years: 0,
      greater_than_four_years: 0,
      name: "general_contractor_projects",
    },
  ];

  const getFormValuesForRow = (rowName) => {
    const values = form.getState().values || {};
    if (name) {
      const parent = getIn(values, name) || {};
      return parent[rowName] || {};
    }
    return values[rowName] || {};
  };

  const initializeRowData = () =>
    initialRowData.map((row) => {
      const fv = getFormValuesForRow(row.name);
      return {
        ...row,
        last_two_years: fv.last_two_years ?? row.last_two_years,
        two_to_four_years: fv.two_to_four_years ?? row.two_to_four_years,
        greater_than_four_years:
          fv.greater_than_four_years ?? row.greater_than_four_years,
      };
    });

  const [rowData, setRowData] = useState(initializeRowData);

  const columnDefs = [
    {
      headerName: "Experience Description",
      field: "description",
      flex: 1,
      width: 120,
      suppressSizeToFit: true,
      cellStyle: {
        backgroundColor: "#f5f5f5",
        borderRight: "1px solid #ddd",
      },
    },
    {
      headerName: "Last 2 Years",
      field: "last_two_years",
      width: 120,
      editable: true,
      cellStyle: {
        backgroundColor: "#fff",
        textAlign: "center",
        borderRight: "1px solid #ddd",
      },
      valueParser: (p) => Number(p.newValue),
    },
    {
      headerName: "Greater than 2 years, Less than 4 years",
      field: "two_to_four_years",
      width: 180,
      editable: true,
      cellStyle: {
        backgroundColor: "#fff",
        textAlign: "center",
        borderRight: "1px solid #ddd",
      },
      valueParser: (p) => Number(p.newValue),
    },
    {
      headerName: "> 4 years since completion",
      field: "greater_than_four_years",
      width: 180,
      editable: true,
      cellStyle: {
        backgroundColor: "#fff",
        textAlign: "center",
      },
      valueParser: (p) => Number(p.newValue),
    },
    { headerName: "Name", field: "name", hide: true },
  ];

  const defaultColDef = useMemo(
    () => ({
      resizable: true,
      sortable: false,
      // ← wrap text in cells
      wrapText: true,
      autoHeight: true,
      // ← wrap text in headers
      headerWrapText: true,
      autoHeaderHeight: true,
      cellStyle: {
        whiteSpace: "normal",
        fontSize: "13px",
        paddingLeft: "10px",
        display: "flex",
        alignItems: "center",
        textAlign: "left",
        paddingRight: "10px",
      },
      headerClass: "ag-header-cell-wrap", // built-in AG-Grid header class
    }),
    []
  );

  const onCellValueChanged = useCallback(
    (params) => {
      const { data, colDef, newValue } = params;
      const field = colDef.field;
      if (
        [
          "last_two_years",
          "two_to_four_years",
          "greater_than_four_years",
        ].includes(field)
      ) {
        const path = buildPath(name, data.name, field);
        const old = getIn(form.getState().values, path);
        const num = Number(newValue);
        if (old !== num) {
          form.change(path, num);
          setRowData((rd) =>
            rd.map((r) => (r.name === data.name ? { ...r, [field]: num } : r))
          );
        }
      }
    },
    [form, name]
  );

  useEffect(() => {
    // initialize form & subscribe...
    const vals = form.getState().values || {};
    initialRowData.forEach((r) => {
      [
        "last_two_years",
        "two_to_four_years",
        "greater_than_four_years",
      ].forEach((f) => {
        const p = buildPath(name, r.name, f);
        if (getIn(vals, p) === undefined) form.change(p, r[f]);
      });
    });

    const sub = form.subscribe(
      ({ values }) => {
        if (!values) return;
        setRowData(initializeRowData());
      },
      { values: true }
    );

    return sub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form, name]);

  return (
    <RffInputWrapper
      size={12}
      label={label}
      sx={{
        // ensure header text truly wraps and doesn't ellipsize
        ".ag-header-cell-wrap .ag-header-cell-text": {
          whiteSpace: "normal !important",
          overflow: "visible !important",
          textOverflow: "unset !important",
          lineHeight: "1.2 !important",
        },
        ".ag-cell": {
          whiteSpace: "normal !important",
          lineHeight: "1.2 !important",
        },
      }}
    >
      <AgGridTableWrapper suppressBorder suppressBorderRadius size={4}>
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          onCellValueChanged={onCellValueChanged}
          headerHeight={36}
          singleClickEdit
          stopEditingWhenCellsLoseFocus
          suppressMovableColumns
          domLayout="autoHeight"
          key={JSON.stringify(rowData)}
        />
      </AgGridTableWrapper>
    </RffInputWrapper>
  );
};

export default RffLoanBorrowerExperienceTable;
