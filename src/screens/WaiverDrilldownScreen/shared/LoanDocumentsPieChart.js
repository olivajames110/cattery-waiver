import React, { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import { lighten, darken } from "@mui/material/styles";
import {
  blueGrey,
  amber,
  lightGreen,
  green,
  blue,
  yellow,
} from "@mui/material/colors";

const baseColors = [
  blueGrey[500],
  amber[500],
  lightGreen[500],
  green[500],
  blue[500],
  yellow[500],
];

const LoanDocumentsPieChart = ({ loanDocuments }) => {
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    // 1. Aggregate counts by docGroup and docType
    const groupMap = {};
    loanDocuments.forEach(({ docGroup, docType }) => {
      if (!docGroup) return;
      if (!groupMap[docGroup]) {
        groupMap[docGroup] = { count: 0, types: {} };
      }
      groupMap[docGroup].count++;
      if (docType) {
        groupMap[docGroup].types[docType] =
          (groupMap[docGroup].types[docType] || 0) + 1;
      }
    });

    // 2. Build inner-ring and outer-ring data arrays
    const groupData = [];
    const typeData = [];
    Object.entries(groupMap).forEach(([group, info], i) => {
      const baseColor = baseColors[i % baseColors.length];
      groupData.push({ docGroup: group, count: info.count });

      const typesArr = Object.entries(info.types);
      typesArr.forEach(([docType, count], j) => {
        const ratio = (j + 1) / (typesArr.length + 1);
        const variantColor =
          j % 2 === 0
            ? lighten(baseColor, ratio * 0.5)
            : darken(baseColor, ratio * 0.5);

        typeData.push({ docType, count, fill: variantColor });
      });
    });

    // 3. Set up nested-pie chart options
    setChartOptions({
      padding: { top: 16, right: 30, bottom: 16, left: 0 },
      // height: 300,
      // width: 500,
      legend: {
        enabled: true,
        position: "right",
        item: { marker: { shape: "circle", size: 10 } },
      },
      series: [
        // inner ring: docGroup (shown in legend)
        {
          type: "pie",
          labelKey: "docGroup",
          legendItemKey: "docGroup",
          angleKey: "count",
          calloutLabelKey: "docGroup",
          innerRadiusRatio: 0.5,
          fills: groupData.map((_, idx) => baseColors[idx % baseColors.length]),
          strokes: groupData.map(() => "#fff"),
          strokeWidth: 1,
          data: groupData,
          showInLegend: true, // <-- ensure this series is in the legend
        },
        // outer ring: docType (hidden from legend)
        {
          type: "pie",
          labelKey: "docType",
          angleKey: "count",
          calloutLabelKey: "docType",
          innerRadiusRatio: 0.7,
          outerRadiusOffset: 20,
          fills: typeData.map((d) => d.fill),
          strokes: typeData.map(() => "#fff"),
          strokeWidth: 1,
          data: typeData,
          showInLegend: false, // <-- hide docType entries
        },
      ],
    });
  }, [loanDocuments]);

  return <AgCharts options={chartOptions} />;
};

export default LoanDocumentsPieChart;
