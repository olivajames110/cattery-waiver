import React, { memo, useMemo } from "react";
import { useSelector } from "react-redux";

import EditableDataRow from "../../components/common/EditableDataRow";
import RffLoanDataGroup from "../../components/finalForm/shared/RffLoanDataGroup";
import TitledGroup from "../../components/ui/TitledGroup";
import DrilldownSidebarPane from "./sidebar/DrilldownSidebarPane";
import LoanTotalsDonutChart from "./shared/LoanTotalsDonutChart";
import Flx from "../../components/layout/Flx";
import {
  KeyboardDoubleArrowLeftRounded,
  KeyboardDoubleArrowRightRounded,
} from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import { blueGrey } from "@mui/material/colors";
import Txt from "../../components/typography/Txt";
const CELL_VALUE_SIZE = 5;
const LoanDrilldownTotalsLeftSidebar = memo(({ show, onClose, onOpen }) => {
  if (!show) return;
  // if (!show) return <CollapsedSidebar onOpen={onOpen} />;

  return (
    <DrilldownSidebarPane
      initialWidth="295px"
      title="Loan Totals"
      // bodyPadding={0}
      // bodyOverflow="hidden"
      onClose={onClose}
      onCloseIcon={<KeyboardDoubleArrowLeftRounded />}
    >
      <LoanTotals />
    </DrilldownSidebarPane>
  );
});

const LoanTotals = ({ children }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);

  // If your "loanDrilldown" has all these fields, we pass them as initialValues
  return (
    <TitledGroup
      variant="h4"
      // title="Totals"
      //
      suppressPaddingTopBottom
    >
      <Box sx={{ width: "100%", overflow: "hidden", mb: 2 }}>
        <LoanTotalsDonutChart loanData={loanDrilldown} />
      </Box>
      <Flx column>
        <ConditionalLogicField />
        <ConstantFields />
      </Flx>
    </TitledGroup>
  );
};

const ConditionalLogicField = ({ children }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  return (
    <>
      <RffLoanDataGroup column initialValues={loanDrilldown}>
        {/***********************************************************************
         * 7) totalLoanAmount
         *    Shown for ALL product types + ANY of the 4 standard Purposes
         *    plus Foreclosure Bail Out (refi).
         ***********************************************************************/}
        <EditableDataRow
          name="totalLoanAmount"
          label="Total Loan Amount"
          type="dollar"
          disabled
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          condition={{
            operator: "OR",
            rules: [
              // Fix and Flip (all 4)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Fix and Flip",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Ground Up Construction
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Ground Up Construction",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Stabilized Bridge
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Stabilized Bridge",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // DSCR
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "DSCR",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Vacant Land
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Vacant Land",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Other
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Other",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Foreclosure Bail Out (always refi)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Foreclosure Bail Out",
                  },
                ],
              },
            ],
          }}
        />

        <EditableDataRow
          name="totalPurchasePrice"
          label="Total Purchase Price"
          type="dollar"
          disabled
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          condition={{
            operator: "OR",
            rules: [
              // Fix and Flip
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Fix and Flip",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Purchase", "Delayed Purchase"],
                  },
                ],
              },
              // Ground Up Construction
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Ground Up Construction",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Purchase", "Delayed Purchase"],
                  },
                ],
              },
              // Stabilized Bridge
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Stabilized Bridge",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Purchase", "Delayed Purchase"],
                  },
                ],
              },
              // DSCR
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "DSCR",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Purchase", "Delayed Purchase"],
                  },
                ],
              },
              // Vacant Land
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Vacant Land",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Purchase", "Delayed Purchase"],
                  },
                ],
              },
              // Other
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Other",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Purchase", "Delayed Purchase"],
                  },
                ],
              },
            ],
          }}
        />

        {/***********************************************************************
         * 2) totalAsIsValue
         *    Show for basically ALL product types/purposes, because it's relevant
         *    in each scenario. For "Foreclosure Bail Out," it's always refi, so
         *    we handle that with loanPurpose in Refi - No Cash, Refi - Cash.
         ***********************************************************************/}
        <EditableDataRow
          name="totalAsIsValue"
          label="Total As Is Value"
          type="dollar"
          disabled
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          condition={{
            operator: "OR",
            rules: [
              // Fix and Flip (all 4 purchase/refi/cash/delayed)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Fix and Flip",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Ground Up Construction (all 4)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Ground Up Construction",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Stabilized Bridge (all 4)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Stabilized Bridge",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // DSCR (all 4)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "DSCR",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Vacant Land (all 4)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Vacant Land",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Other (all 4)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Other",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Foreclosure Bail Out => always refi
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Foreclosure Bail Out",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Refinance - No Cash Out", "Refinance - Cash Out"],
                  },
                ],
              },
            ],
          }}
        />

        <EditableDataRow
          name="totalSecondaryAsIsValue"
          label="Total Secondary As-Is Value"
          type="dollar"
          disabled
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          condition={{
            operator: "OR",
            rules: [
              // Fix and Flip (all 4 purchase/refi/cash/delayed)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Fix and Flip",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Ground Up Construction (all 4)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Ground Up Construction",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Stabilized Bridge (all 4)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Stabilized Bridge",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // DSCR (all 4)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "DSCR",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Vacant Land (all 4)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Vacant Land",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Other (all 4)
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Other",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Foreclosure Bail Out => always refi
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Foreclosure Bail Out",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Refinance - No Cash Out", "Refinance - Cash Out"],
                  },
                ],
              },
            ],
          }}
        />

        {/***********************************************************************
         * 3) totalArv
         *    Show only for:
         *      - Fix and Flip (any purpose)
         *      - Ground Up Construction (any purpose)
         *    Usually not relevant to Stabilized, DSCR, etc.
         ***********************************************************************/}
        <EditableDataRow
          name="totalArv"
          label="Total ARV"
          type="dollar"
          disabled
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          condition={{
            operator: "OR",
            rules: [
              // Fix and Flip + all 4 loanPurpose
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Fix and Flip",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Ground Up Construction + all 4 loanPurpose
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Ground Up Construction",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
            ],
          }}
        />

        <EditableDataRow
          name="totalSecondaryArv"
          label="Total Secondary ARV"
          type="dollar"
          disabled
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          condition={{
            operator: "OR",
            rules: [
              // Fix and Flip + all 4 loanPurpose
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Fix and Flip",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Ground Up Construction + all 4 loanPurpose
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Ground Up Construction",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
            ],
          }}
        />

        {/***********************************************************************
         * 4) totalCostBasis
         *    Show for Fix and Flip, Ground Up Construction (all purposes).
         ***********************************************************************/}
        <EditableDataRow
          name="totalCostBasis"
          label="Total Cost Basis"
          type="dollar"
          disabled
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          condition={{
            operator: "OR",
            rules: [
              // Fix and Flip
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Fix and Flip",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Ground Up Construction
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Ground Up Construction",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
            ],
          }}
        />

        {/***********************************************************************
         * 5) totalConstructionBudget
         *    Show only for Ground Up Construction (all purposes).
         ***********************************************************************/}
        <EditableDataRow
          name="totalConstructionBudget"
          label="Total Construction Budget"
          type="dollar"
          disabled
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          condition={{
            operator: "AND",
            rules: [
              {
                field: "loanProductType",
                operator: "==",
                value: "Ground Up Construction",
              },
              {
                field: "loanPurpose",
                operator: "includes",
                value: [
                  "Purchase",
                  "Refinance - No Cash Out",
                  "Refinance - Cash Out",
                  "Delayed Purchase",
                ],
              },
            ],
          }}
        />

        {/***********************************************************************
         * 6) outstandingLoanUpb
         *    Show for “Refinance - No Cash Out” or “Refinance - Cash Out” in:
         *      - Fix and Flip
         *      - Ground Up Construction
         *      - Stabilized Bridge
         *      - DSCR
         *      - Vacant Land
         *      - Other
         *    AND always for “Foreclosure Bail Out” (since that’s a refi).
         ***********************************************************************/}
        <EditableDataRow
          name="outstandingLoanUpb"
          label="Outstanding Loan UPB"
          type="dollar"
          disabled
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          condition={{
            operator: "OR",
            rules: [
              // F&F Refi
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Fix and Flip",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Refinance - No Cash Out", "Refinance - Cash Out"],
                  },
                ],
              },
              // GUC Refi
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Ground Up Construction",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Refinance - No Cash Out", "Refinance - Cash Out"],
                  },
                ],
              },
              // Stabilized Bridge Refi
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Stabilized Bridge",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Refinance - No Cash Out", "Refinance - Cash Out"],
                  },
                ],
              },
              // DSCR Refi
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "DSCR",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Refinance - No Cash Out", "Refinance - Cash Out"],
                  },
                ],
              },
              // Vacant Land Refi
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Vacant Land",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Refinance - No Cash Out", "Refinance - Cash Out"],
                  },
                ],
              },
              // Other Refi
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Other",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: ["Refinance - No Cash Out", "Refinance - Cash Out"],
                  },
                ],
              },
              // Foreclosure Bail Out => always refi, so just match product type
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Foreclosure Bail Out",
                  },
                ],
              },
            ],
          }}
        />

        {/***********************************************************************
         * 8) totalAnnualTaxes
         *    Show for Stabilized Bridge, DSCR, Vacant Land, Other, Foreclosure
         *    (not typically relevant to Fix/Flip or GUC).
         *    For Foreclosure Bail Out, we assume always refi.
         ***********************************************************************/}
        {/* <EditableDataRow
          name="totalAnnualTaxes"
          label="Total Annual Taxes"
          type="dollar"
          disabled
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          condition={{
            operator: "OR",
            rules: [
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Fix and Flip",
                  },
                  {
                    field: "loanPurpose",
                    operator: "==",
                    value: "Purchase",
                  },
                ],
              },
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Ground Up Construction",
                  },
                  {
                    field: "loanPurpose",
                    operator: "==",
                    value: "Refinance - Cash Out",
                  },
                ],
              },
            ],
          }}
        /> */}

        {/***********************************************************************
         * 9) totalAnnualInsurance
         *    Same logic as totalAnnualTaxes (Stabilized, DSCR, Vacant Land,
         *    Other, and Foreclosure Bail Out).
         ***********************************************************************/}
        <EditableDataRow
          name="totalAnnualInsurance"
          label="Total Annual Insurance"
          type="dollar"
          disabled
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          condition={{
            operator: "OR",
            rules: [
              // Stabilized Bridge
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Stabilized Bridge",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // DSCR
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "DSCR",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Vacant Land
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Vacant Land",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Other
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Other",
                  },
                  {
                    field: "loanPurpose",
                    operator: "includes",
                    value: [
                      "Purchase",
                      "Refinance - No Cash Out",
                      "Refinance - Cash Out",
                      "Delayed Purchase",
                    ],
                  },
                ],
              },
              // Foreclosure Bail Out => always refi
              {
                operator: "AND",
                rules: [
                  {
                    field: "loanProductType",
                    operator: "==",
                    value: "Foreclosure Bail Out",
                  },
                ],
              },
            ],
          }}
        />
      </RffLoanDataGroup>
    </>
  );
};

const ConstantFields = ({ children }) => {
  const loanDrilldown = useSelector((state) => state.loanDrilldown);
  return (
    <>
      {/* <RffLoanDataGroup column initialValues={loanDrilldown}> */}
      <Flx column initialValues={loanDrilldown}>
        <EditableDataRow
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          placeholder={"—"}
          disabled={true}
          name="totalAssignmentFees"
          label="Total Assignment Fees"
          type="dollar"
        />
        <EditableDataRow
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          placeholder={"—"}
          disabled={true}
          name="totalAnnualTaxes"
          label="Total Annual Taxes"
          type="dollar"
        />

        <EditableDataRow
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          placeholder={"—"}
          disabled={true}
          name="totalAnnualFloodInsurance"
          label="Total Annual Flood Insurance"
          type="dollar"
        />
        <EditableDataRow
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          placeholder={"—"}
          disabled={true}
          name="totalAnnualHoaFees"
          label="Total Annual HOA Fees"
          type="dollar"
        />
        <EditableDataRow
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          placeholder={"—"}
          disabled={true}
          name="totalAnnualPropertyMgmtFees"
          label="Total Annual Property Mgmt Fees"
          type="dollar"
        />
        <EditableDataRow
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          placeholder={"—"}
          disabled={true}
          name="totalAnnualOtherExpense"
          label="Total Annual Other Expense"
          type="dollar"
        />
        <EditableDataRow
          data={loanDrilldown}
          cellValueSize={CELL_VALUE_SIZE}
          placeholder={"—"}
          disabled={true}
          name="totalConstructionBudget"
          label="Total Construction Budget"
          type="dollar"
          suppressBottomBorder
        />
      </Flx>
    </>
  );
};

const CollapsedSidebar = ({ onOpen }) => {
  const styles = useMemo(() => {
    return {
      width: "32px",
      borderLeft: `1px solid ${blueGrey[100]}`,
      borderRight: `1px solid ${blueGrey[100]}`,
    };
  }, []);

  return (
    <Box
      role="button"
      onClick={onOpen}
      sx={{
        cursor: "pointer",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "32px",
        borderLeft: `1px solid ${blueGrey[100]}`,
        borderRight: `1px solid ${blueGrey[100]}`,
        position: "relative",
        "&:hover": {
          backgroundColor: "#fdfefe",
          transition: "background-color 0.3s ease",
        },
      }}
    >
      {/* <Txt
        sx={{
          position: "absolute",
          top: "50%",
          transform: "translateX(-50%) rotate(-90deg)",
          left: 0,
          // transform: "rotate(-90deg)",
          // transformOrigin: "center",

          // height: "100%",
          whiteSpace: "nowrap",
        }}
      >
        View Loan Totals
      </Txt> */}
      <KeyboardDoubleArrowRightRounded />
    </Box>
  );
  return (
    <Box sx={styles}>
      <Button
        fullWidth
        sx={{
          transform: "rotate(-90deg)",
          // Optional adjustments for better positioning
          transformOrigin: "center",
        }}
      >
        Show Loan Totals
      </Button>
      {/* <KeyboardDoubleArrowLeftRounded /> */}
    </Box>
  );
};
/** Sidebar logic to route between "comments" and "formSpy" */

export default LoanDrilldownTotalsLeftSidebar;
