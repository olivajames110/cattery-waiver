import { AgCharts } from "ag-charts-react";
import React, { useEffect, useState, useCallback } from "react";
import { fileDocGroups } from "../../../config/fileDocGroupAndTypes";
import { isEmpty } from "lodash";
import Txt from "../../../components/typography/Txt";
import {
  amber,
  blue,
  blueGrey,
  green,
  lightGreen,
  yellow,
} from "@mui/material/colors";

export function DocumentTrackingBarChart({ loanDocuments = [] }) {
  const NORMAL_COLOR = blueGrey[500]; // Blue for normal documents
  const HIDDEN_COLOR = amber[500]; // Yellow for hidden documents
  const FINAL_COLOR = lightGreen[500]; // Green for final documents

  const [chartOptions, setChartOptions] = useState(null);

  // Define all possible document groups
  const allPossibleDocGroups = fileDocGroups;

  // Function to create chart options - moved to useCallback to prevent recreation on each render
  const createChartOptions = useCallback(
    (chartData) => {
      return {
        data: chartData,
        series: [
          {
            type: "bar",
            xKey: "group",
            yKey: "finalCount",
            yName: "Final",
            stackGroup: "status",
            cornerRadius: 4,
            fill: FINAL_COLOR, // Green for final documents
            highlightStyle: { fill: "#2e7d32" },
            maxBarWidth: 50,
            label: {
              enabled: true,
              fontSize: 10,
              formatter: (params) => {
                // Only show label if count is greater than zero
                return params.value > 0 ? params.value.toString() : "";
              },
            },
            tooltip: {
              renderer: (params) => {
                const { datum } = params;
                const fileList = datum.finalFiles || [];
                const filesListMarkup =
                  fileList.length > 0
                    ? fileList
                        .map((f) => `<li style="margin-bottom:4px">${f}</li>`)
                        .join("")
                    : "<li style='margin-bottom:4px'>No final documents</li>";

                return `
                  <div style="padding: 10px; max-width: 400px">
                    <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;
                                border-bottom: 1px solid #ddd; padding-bottom: 6px">
                      ${datum.group}: Final Documents (${fileList.length})
                    </div>
                    <div style="max-height: 200px; overflow-y: auto">
                      <ul style="margin: 0; padding-left: 20px">
                        ${filesListMarkup}
                      </ul>
                    </div>
                  </div>
                `;
              },
            },
          },
          {
            type: "bar",
            xKey: "group",
            yKey: "hiddenCount",
            yName: "Hidden",
            stackGroup: "status",
            cornerRadius: 4,
            fill: HIDDEN_COLOR, // Yellow for hidden documents
            highlightStyle: { fill: "#fbc02d" },
            maxBarWidth: 50,
            label: {
              fontSize: 10,
              enabled: true,
              formatter: (params) => {
                // Only show label if count is greater than zero
                return params.value > 0 ? params.value.toString() : "";
              },
            },
            tooltip: {
              renderer: (params) => {
                const { datum } = params;
                const fileList = datum.hiddenFiles || [];
                const filesListMarkup =
                  fileList.length > 0
                    ? fileList
                        .map((f) => `<li style="margin-bottom:4px">${f}</li>`)
                        .join("")
                    : "<li style='margin-bottom:4px'>No hidden documents</li>";

                return `
                  <div style="padding: 10px; max-width: 400px">
                    <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;
                                border-bottom: 1px solid #ddd; padding-bottom: 6px">
                      ${datum.group}: Hidden Documents (${fileList.length})
                    </div>
                    <div style="max-height: 200px; overflow-y: auto">
                      <ul style="margin: 0; padding-left: 20px">
                        ${filesListMarkup}
                      </ul>
                    </div>
                  </div>
                `;
              },
            },
          },
          {
            type: "bar",
            xKey: "group",
            yKey: "normalCount",
            yName: "Normal",
            stackGroup: "status",
            cornerRadius: 4,
            fill: NORMAL_COLOR, // Blue for normal documents
            highlightStyle: { fill: "#2196f3" },
            maxBarWidth: 50,
            label: {
              fontSize: 10,
              enabled: true,
              formatter: (params) => {
                // Only show label if count is greater than zero
                return params.value > 0 ? params.value.toString() : "";
              },
            },
            tooltip: {
              renderer: (params) => {
                const { datum } = params;
                const fileList = datum.normalFiles || [];
                const filesListMarkup =
                  fileList.length > 0
                    ? fileList
                        .map((f) => `<li style="margin-bottom:4px">${f}</li>`)
                        .join("")
                    : "<li style='margin-bottom:4px'>No normal documents</li>";

                return `
                  <div style="padding: 10px; max-width: 400px">
                    <div style="font-weight: bold; font-size: 14px; margin-bottom: 8px;
                                border-bottom: 1px solid #ddd; padding-bottom: 6px">
                      ${datum.group}: Normal Documents (${fileList.length})
                    </div>
                    <div style="max-height: 200px; overflow-y: auto">
                      <ul style="margin: 0; padding-left: 20px">
                        ${filesListMarkup}
                      </ul>
                    </div>
                  </div>
                `;
              },
            },
          },
        ],
        axes: [
          {
            type: "category",
            position: "bottom",
            label: {
              rotation: -35,
              fontSize: 11,
              fontStyle: "italic",
              color: "#555555",
            },
          },
          {
            type: "number",
            position: "left",
            label: {
              fontSize: 11,
              color: "#555555",
            },
          },
        ],
        legend: {
          enabled: true,
          position: "bottom",
        },
        padding: {
          top: 16,
          right: 16,
          bottom: 16,
          left: 16,
        },
        height: 320,
        autoSize: false, // Don't auto resize, use explicit dimensions
      };
    },
    [FINAL_COLOR, HIDDEN_COLOR, NORMAL_COLOR]
  ); // Only recreate if colors change

  useEffect(() => {
    // Initialize empty chart data with all possible groups (with zero counts)
    const initialChartData = allPossibleDocGroups.map((group) => {
      // Replace "Documents" with "Docs" in group names
      const formattedGroup = group.replace("Documents", "Docs");

      return {
        group:
          group === "Letter of Explanation & Exceptions"
            ? "LOE & Exceptions"
            : formattedGroup,
        finalCount: 0,
        hiddenCount: 0,
        normalCount: 0,
        finalFiles: [],
        hiddenFiles: [],
        normalFiles: [],
      };
    });

    if (loanDocuments.length === 0) {
      // Still show all groups but with zero counts
      setChartOptions(createChartOptions(initialChartData));
      return;
    }

    // Initialize document groupings
    const docGroups = {};

    // Initialize with all possible groups
    initialChartData.forEach((item) => {
      docGroups[item.group] = {
        finalFiles: [],
        hiddenFiles: [],
        normalFiles: [],
      };
    });

    // Group documents by docGroup and status
    loanDocuments.forEach((doc) => {
      const groupName = doc.docGroup || "Uncategorized";
      // Replace "Documents" with "Docs" in group names
      const formattedGroupName = groupName.replace("Documents", "Docs");
      const displayName = doc.file_display_name;

      // Special case for "Letter of Explanation & Exceptions"
      const finalGroupName =
        formattedGroupName === "Letter of Explanation & Exceptions"
          ? "LOE & Exceptions"
          : formattedGroupName;

      // Create the group if it doesn't exist
      if (!docGroups[finalGroupName]) {
        docGroups[finalGroupName] = {
          finalFiles: [],
          hiddenFiles: [],
          normalFiles: [],
        };
      }

      // Categorize the document based on its status
      if (doc.isFinal) {
        docGroups[finalGroupName].finalFiles.push(displayName);
      } else if (doc.isHidden) {
        docGroups[finalGroupName].hiddenFiles.push(displayName);
      } else {
        docGroups[finalGroupName].normalFiles.push(displayName);
      }
    });

    // Build chart data: each entry => { group, finalCount, hiddenCount, normalCount, finalFiles[], hiddenFiles[], normalFiles[] }
    const chartData = Object.entries(docGroups).map(([group, files]) => ({
      group,
      finalCount: files.finalFiles.length,
      hiddenCount: files.hiddenFiles.length,
      normalCount: files.normalFiles.length,
      finalFiles: files.finalFiles,
      hiddenFiles: files.hiddenFiles,
      normalFiles: files.normalFiles,
    }));

    // Sort the chartData alphabetically by group
    chartData.sort((a, b) => a.group.localeCompare(b.group));

    // Update chart options with the new data
    setChartOptions(createChartOptions(chartData));
  }, [loanDocuments, allPossibleDocGroups, createChartOptions]); // Added createChartOptions to dependencies

  if (!chartOptions) {
    return <div>Loading chart...</div>;
  }

  return <AgCharts options={chartOptions} />;
}
