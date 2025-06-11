import React from "react";
import { Grid } from "@mui/material";
import rffEvaluateFieldCondition from "../../../utils/finalForm/rffEvaluateFieldCondition";
import { blue } from "@mui/material/colors";
import { useFormState } from "react-final-form";
import { get } from "lodash";

/**
 * A conditional wrapper component for React Final Form fields
 * Supports both simple conditions and complex nested rule groups
 */
const RffConditional = ({
  // Single-rule props
  field,
  operator,
  value,
  // Multi-rule props
  rules,
  // Operator for multiple rules, defaults to "AND"
  operatorForMultiple = "AND",
  // Complete condition object prop
  condition: conditionObj,
  // Testing props
  testing,
  // Children to conditionally render
  children,
}) => {
  const { values } = useFormState();

  // Determine which condition format we're using
  let condition;

  if (conditionObj) {
    // If a full condition object was passed, use it directly
    condition = conditionObj;
  } else if (rules) {
    // If rules were provided, use the multi-rule format
    condition = {
      operator: operatorForMultiple,
      rules: rules,
    };
  } else if (field) {
    // If field was provided, use the single rule format
    condition = {
      operator: operator || "==",
      rules: [
        {
          field,
          operator: operator || "==",
          value,
        },
      ],
    };
  } else {
    // Default case - no condition, render children
    return <>{children}</>;
  }

  if (testing?.enabled) {
    if (testing?.showHidden) {
      // Create a human-readable representation of the conditions
      const renderConditions = () => {
        const renderRule = (rule, index) => {
          const { field, operator, value, rules: nestedRules } = rule;

          // If the rule has nested rules, it's a rule group
          if (nestedRules) {
            return (
              <div key={index} style={{ margin: "4px 0", paddingLeft: "12px" }}>
                <strong>{rule.operator} Group:</strong>
                {nestedRules.map((r, i) => renderRule(r, `${index}-${i}`))}
              </div>
            );
          }

          // It's a simple rule
          const fieldValue = field ? get(values, field) : undefined;

          return (
            <div key={index} style={{ margin: "4px 0" }}>
              <code>{field}</code> <strong>{operator}</strong>{" "}
              <code>{JSON.stringify(value)}</code>
              {field && (
                <span>
                  {" "}
                  (current: <code>{JSON.stringify(fieldValue)}</code>)
                </span>
              )}
            </div>
          );
        };

        return (
          <div
            style={{
              padding: "8px",
              marginBottom: "8px",
              border: "1px dashed #999",
              background: "#f5f5f5",
              fontSize: "12px",
              fontFamily: "monospace",
            }}
          >
            <div style={{ marginBottom: "4px" }}>
              <strong>
                Condition ({condition.operator}
                ):
              </strong>
            </div>
            {condition.rules.map((rule, index) => renderRule(rule, index))}
          </div>
        );
      };

      return (
        <Grid
          item
          xs={12}
          className="conditional-root"
          sx={{
            ".input-wrapper-root": { background: blue[50] },
          }}
        >
          {children}
          {renderConditions()}
        </Grid>
      );
    }
  }

  // Evaluate the condition against current form values
  const shouldRender = rffEvaluateFieldCondition(condition, values);

  if (!shouldRender) {
    return null;
  }

  return <>{children}</>;
};

export default RffConditional;

// import { Grid } from "@mui/material";
// import rffEvaluateFieldCondition from "../../../utils/finalForm/rffEvaluateFieldCondition";
// import { blue } from "@mui/material/colors";
// import { useFormState } from "react-final-form";
// import { get } from "lodash";

// const RffConditional = ({
//   // Single-rule props
//   field,
//   operator,
//   value,
//   // Multi-rule props
//   rules,
//   // Operator for multiple rules, defaults to "AND"
//   operatorForMultiple = "AND",
//   testing,
//   children,
// }) => {
//   const { values } = useFormState();

//   /**
//    * If `rules` is provided, we'll assume multiple rules usage.
//    * Otherwise, if `field` is given, we treat it as a single rule.
//    */
//   const condition = rules
//     ? {
//         operator: operatorForMultiple,
//         rules: rules,
//       }
//     : {
//         operator: operator || "==",
//         rules: [
//           {
//             field,
//             operator: operator || "==",
//             value,
//           },
//         ],
//       };

//   if (testing?.enabled) {
//     if (testing?.showHidden) {
//       // Create a human-readable representation of the conditions
//       const renderConditions = () => {
//         const renderRule = (rule, index) => {
//           const { field, operator, value } = rule;
//           const fieldValue = get(values, field);

//           return (
//             <div key={index} style={{ margin: "4px 0" }}>
//               <code>{field}</code> <strong>{operator}</strong>{" "}
//               <code>{JSON.stringify(value)}</code>
//             </div>
//           );
//         };

//         return (
//           <div
//             style={{
//               padding: "8px",
//               marginBottom: "8px",
//               border: "1px dashed #999",
//               background: "#f5f5f5",
//               fontSize: "12px",
//               fontFamily: "monospace",
//             }}
//           >
//             <div style={{ marginBottom: "4px" }}>
//               <strong>
//                 Condition (
//                 {condition.rules.length > 1
//                   ? condition.operator
//                   : "Single Rule"}
//                 ):
//               </strong>
//             </div>
//             {condition.rules.map(renderRule)}
//           </div>
//         );
//       };

//       return (
//         <Grid
//           item
//           xs={12}
//           className="conditional-root"
//           sx={{
//             ".input-wrapper-root": { background: blue[50] },
//           }}
//         >
//           {children}
//           {renderConditions()}
//         </Grid>
//       );
//     }
//   }

//   const shouldRender = rffEvaluateFieldCondition(condition, values);

//   if (!shouldRender) {
//     return null;
//   }

//   return <>{children}</>;
// };
// export default RffConditional;
