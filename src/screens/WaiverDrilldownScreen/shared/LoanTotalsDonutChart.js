import { AgCharts } from "ag-charts-react";
import React, { useMemo, useEffect, useState } from "react";

// Field name to display name mapping for better labels
const fieldDisplayNames = {
  baseLoanAmount: "Base Loan Amount",
  totalPurchasePrice: "Purchase Price",
  totalAsIsValue: "As-Is Value",
  totalArv: "ARV",
  totalCostBasis: "Cost Basis",
  totalHoldback: "Total Holdback",
  totalLoanAmount: "Loan Amount",
  outstandingLoanUpb: "Outstanding UPB",
  totalConstructionBudget: "Construction Budget",
  totalAnnualTaxes: "Annual Taxes",
  totalAnnualInsurance: "Annual Insurance",
};

// Colors for the donut chart segments
const COLORS = [
  "#5470c6",
  "#91cc75",
  "#fac858",
  "#ee6666",
  "#73c0de",
  "#3ba272",
  "#fc8452",
  "#9a60b4",
  "#ea7ccc",
];

// Format dollar amounts
const formatCurrency = (value) => {
  if (value === undefined || value === null) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const LoanTotalsDonutChart = ({
  loanData,
  enableLegend = false,
  legendPosition = "bottom",
  height = 165,
  width,
}) => {
  const [options, setOptions] = useState(null);

  // Get all fields with "total" in their name or baseLoanAmount and filter for non-zero values
  const fieldsToChart = useMemo(() => {
    if (!loanData) return [];

    return Object.keys(loanData).filter(
      (key) =>
        (key.includes("total") || key === "baseLoanAmount") &&
        loanData[key] !== 0 &&
        typeof loanData[key] === "number"
    );
  }, [loanData]);

  // Build chart data
  const chartData = useMemo(() => {
    if (!loanData) return [];

    return fieldsToChart
      .map((field, index) => {
        const value = loanData[field] || 0;
        // Skip zero values
        if (value <= 0) return null;

        const displayName = fieldDisplayNames[field] || field;
        // Include only the formatted value in the label, not the raw value
        const formattedValue = formatCurrency(value);

        return {
          // Modified to only show the display name and formatted value
          // label: `${displayName} (${formattedValue})`,
          label: displayName,
          value: value,
          field: field, // Keep original field name for reference
          color: COLORS[index % COLORS.length],
        };
      })
      .filter((item) => item !== null); // Filter out null values
  }, [fieldsToChart, loanData]);

  // Calculate total for center label
  const total = useMemo(() => {
    if (!chartData.length) return 0;

    // Here you can decide what "total" means for your chart
    // Option 1: Sum of all values shown in the chart
    // const sum = chartData.reduce((sum, item) => sum + item.value, 0);

    // Option 2: Use the totalLoanAmount or baseLoanAmount as the center value
    const totalLoanAmount = loanData?.totalLoanAmount || 0;
    return totalLoanAmount;
  }, [chartData, loanData]);

  // Update chart options when data changes
  useEffect(() => {
    if (!chartData || chartData.length < 2) {
      setOptions(null);
      return;
    }

    setOptions({
      data: chartData,

      calloutLabel: {
        enabled: false,
      },

      // legend: {
      //   position: "right",
      //   enabled: true,
      //   spacing: 0,
      //   fontSize: 10,
      //   // enabled: false,
      // },

      legend: {
        position: "right",
        enabled: true,
        spacing: 14,
        // spacing: 24,
        // Make legend flush with chart
        // margin: 0,
        item: {
          label: {
            fontSize: 10,
          },
          // paddingX: 8,
          // paddingY: 2,
        },
      },
      height: height,

      // width: width,
      // height: "100%",
      // container: {
      //   padding: 0,
      //   margin: 0,
      // },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
      // margin: {
      //   left: 0,
      //   right: 0,
      //   top: 0,
      //   bottom: 0,
      // },
      width,
      autoSize: false, // Don't auto resize, use explicit dimensions

      // Control the padding to eliminate extra space
      series: [
        {
          type: "donut",
          // No calloutLabelKey to prevent callouts
          angleKey: "value",
          // calloutLabelKey: "label",
          innerRadiusRatio: 0.85,
          fills: chartData.map((item) => item.color),
          legendItemKey: "label", // Use our formatted label for the legend
          // size: 1, // Make donut use full available space
          // centerX: 0.5,
          // centerY: 0.5,

          innerLabels: [
            {
              text: "Total Loan Amount",
              fontSize: 11,
            },
            {
              text: formatCurrency(total),
              spacing: 1,
              fontWeight: "bold",
              fontSize: 14,
            },
          ],
        },
      ],
      // Enable and position the legend
    });
  }, [chartData, total, legendPosition, height, width]);

  if (!options) {
    return (
      <div>No chart data available or insufficient data points for chart.</div>
    );
  }

  return (
    <AgCharts
      //
      options={options}
    />
  );
};

export default LoanTotalsDonutChart;
