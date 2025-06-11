import { AgCharts } from "ag-charts-react";
import { size } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

// Example documents from your loan data

export function DocumentTrackingDonutChart({ loanDocuments }) {
  const [options, setOptions] = useState(null);
  // Aggregate documents by docGroup

  useEffect(() => {
    if (!loanDocuments) {
      setOptions(null);
      return;
    }

    const totalDocumentCount = size(loanDocuments) || 0;

    const docGroupCounts = loanDocuments.reduce((acc, doc) => {
      if (!acc[doc.docGroup]) {
        acc[doc.docGroup] = 0;
      }
      acc[doc.docGroup]++;
      return acc;
    }, {});

    // Convert aggregated object into array for the chart
    const data = Object.keys(docGroupCounts).map((group) => ({
      docGroup: group,
      count: docGroupCounts[group],
    }));

    setOptions({
      data,
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      height: 180,
      autoSize: false, // Don't auto resize, use explicit dimensions,
      series: [
        {
          type: "donut",
          angleKey: "count",
          innerRadiusRatio: 0.75,
          legendItemKey: "docGroup", // Use our formatted label for the legend
          size: 1, // Make donut use full available space
          centerX: 0.5,
          centerY: 0.5,
          innerLabels: [
            {
              text: "Uploaded Files",
              fontSize: 12,
            },
            {
              text: `${totalDocumentCount} Total`,
              spacing: 4,
              fontWeight: "bold",
              fontSize: 14,
            },
          ],
        },
      ],
      calloutLabel: {
        enabled: false,
      },

      legend: {
        position: "left",
        enabled: false,
      },
    });
  }, [loanDocuments]);

  return <AgCharts options={options} />;
}
