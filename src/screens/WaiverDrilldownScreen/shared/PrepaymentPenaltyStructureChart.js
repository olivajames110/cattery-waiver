import React from "react";
import { AgCharts } from "ag-charts-react";

export function PrepaymentPenaltyStructureChart({ loanDrilldown }) {
  // 1. Get the penalty structure string from the loanDrilldown object, or default it.
  const penaltyString =
    loanDrilldown?.prepaymentPenaltyStructure ?? "4% 3% 2% 1%";

  // 2. Split on spaces to handle a string like "4% 3% 2% 1%"
  //    and remove the '%' sign so we can parse numbers cleanly.
  const penaltyValues = penaltyString
    .split(" ")
    .map((str) => parseInt(str.replace("%", ""), 10));

  // 3. Convert the parsed numbers into chart data
  //    e.g., [4, 3, 2, 1] =>
  //    [ { year: 'Year 1', penalty: 4 }, { year: 'Year 2', penalty: 3 }, ...]
  const data = penaltyValues.map((penalty, index) => {
    return {
      year: `Year ${index + 1}`,
      penalty,
    };
  });

  // 4. Define chart options
  const options = {
    autoSize: true,
    title: {
      text: "Prepayment Penalty by Year",
    },
    data,
    series: [
      {
        type: "column",
        xKey: "year",
        yKey: "penalty",
        label: {
          formatter: (params) => `${params.value}%`,
        },
      },
    ],
    axes: [
      { type: "category", position: "bottom" },
      {
        type: "number",
        position: "left",
        title: { text: "Penalty (%)" },
      },
    ],
    legend: { enabled: false },
  };

  // 5. Return the chart
  return <AgCharts options={options} />;
}
