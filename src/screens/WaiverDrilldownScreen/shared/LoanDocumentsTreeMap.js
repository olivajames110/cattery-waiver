import React, { useMemo, useState, useEffect } from "react";
import { AgCharts } from "ag-charts-react";
import isNil from "lodash/isNil";
import { blue, blueGrey, grey } from "@mui/material/colors";
import { useTheme } from "@mui/material";

const LoanDocumentsTreeMap = ({
  loanDocuments = [],
  onClick,
  activeDocGroup = null,
  activeDocType = null,
}) => {
  // const loanDocuments = null;
  const treeData = useMemo(() => {
    const grouping = {};
    loanDocuments.forEach((doc) => {
      const group = doc.docGroup || "No Category";
      const type = doc.docType || "No Category";
      grouping[group] = grouping[group] || {};
      grouping[group][type] = grouping[group][type] || [];
      grouping[group][type].push(doc.file_display_name);
    });

    return Object.entries(grouping)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([group, types]) => {
        // total count for this group
        const groupCount = Object.values(types).reduce(
          (sum, arr) => sum + arr.length,
          0
        );
        return {
          // raw value for callbacks
          label: group,
          // what actually shows on the treemap
          displayLabel: `${group} (${groupCount})`,
          children: Object.entries(types)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([type, files]) => ({
              label: type,
              displayLabel: `${type} (${files.length})`,
              value: files.length,
              fileNames: files,
              parent: group,
            })),
        };
      });
  }, [loanDocuments]);
  const theme = useTheme();
  const options = useMemo(() => {
    const inactiveColor = grey[400];
    // const activeColor = blue[400];
    const activeColor = theme.palette.primary.main;
    return {
      data: treeData,
      series: [
        {
          type: "treemap",
          labelKey: "displayLabel",
          sizeKey: "value",
          childrenKey: "children",
          groupLabels: false,
          tile: {
            label: {
              fontSize: 12,
            },
          },
          fills: [
            blueGrey[300],
            // blue[900],
            // blue[800],
            // blue[700],
            // blue[600],
            // blue[500],
            // blue[400],
            // blue[300],
            // blue[200],
            // blue[100],
            // blue[50],
          ],

          itemStyler: ({ datum }) => {
            if (isNil(activeDocGroup) && isNil(activeDocType)) return;

            // only leaf nodes have fileNames
            if (!datum.fileNames) return;

            // both filters active
            if (activeDocType) {
              if (activeDocType === "No Category" && activeDocGroup) {
                return {
                  fill:
                    datum.label === "No Category" &&
                    datum.parent === activeDocGroup
                      ? activeColor
                      : inactiveColor,
                  stroke: "#fff",
                  strokeWidth: 1,
                };
              }
              return {
                fill:
                  datum.label === activeDocType &&
                  (!activeDocGroup || datum.parent === activeDocGroup)
                    ? activeColor
                    : inactiveColor,
                stroke: "#fff",
                strokeWidth: 1,
              };
            }

            // group-only filter
            if (activeDocGroup) {
              return {
                fill:
                  datum.parent === activeDocGroup ? activeColor : inactiveColor,
                stroke: "#fff",
                strokeWidth: 1,
              };
            }
          },

          listeners: {
            nodeClick: ({ datum }) => {
              onClick?.({
                docGroup: datum.parent ?? datum.label,
                docType: datum.parent ? datum.label : null,
              });
            },
          },

          tooltip: {
            renderer: ({ datum }) => {
              const files = datum.fileNames
                ? datum.fileNames
                : datum.children.flatMap((c) => c.fileNames || []);
              const items = files.length
                ? files.map((f) => `<li>${f}</li>`).join("")
                : "<li>No documents</li>";
              return `
                <div style="padding:10px; max-width:300px">
                  <strong>${datum.label} (${files.length})</strong>
                  <ul style="margin:0; padding-left:20px">
                    ${items}
                  </ul>
                </div>
              `;
            },
          },
        },
      ],
    };
  }, [treeData, activeDocGroup, activeDocType, onClick]);

  const [chartOptions, setChartOptions] = useState(options);
  useEffect(() => setChartOptions(options), [options]);

  return <AgCharts options={chartOptions} />;
};

export default LoanDocumentsTreeMap;
