import get from "lodash/get";

/**
 * Evaluates a condition object against the `values` object from React Final Form.
 * Supports nested rule groups with AND/OR operators.
 *
 * @param {Object} condition - The condition object, e.g.:
 *  {
 *    operator: "AND" | "OR",
 *    rules: [
 *      { field: "someNested.path[0].prop", operator: "==", value: "foo" },
 *      {
 *        operator: "OR",
 *        rules: [
 *          { field: "anotherField", operator: "==", value: "bar" },
 *          ...
 *        ]
 *      },
 *      ...
 *    ]
 *  }
 * @param {Object} values - The form values.
 * @returns {boolean} - True if the condition is satisfied, false otherwise.
 */
export const rffEvaluateFieldCondition = (condition, values) => {
  if (!condition || !condition.rules) return true;

  const { operator, rules } = condition;

  // Evaluate a rule, which can be either a simple rule or a rule group
  const evaluateRule = (rule) => {
    // If the rule has its own rules, it's a rule group
    if (rule.rules) {
      // Recursively evaluate the nested rule group
      return rffEvaluateFieldCondition(rule, values);
    }

    // It's a simple rule
    const { field, operator, value } = rule;

    // Use lodash.get to handle nested path strings (including array indices)
    const fieldValue = get(values, field);

    return evaluateCondition(fieldValue, operator, value);
  };

  const results = rules.map(evaluateRule);

  // Combine results based on the main operator ("AND" or "OR")
  return operator === "AND" ? results.every(Boolean) : results.some(Boolean);
};

/**
 * Evaluates an individual condition based on the operator.
 *
 * @param {any} fieldValue - The value from the form
 * @param {string} operator - The comparison operator
 * @param {any} value - The value to compare against
 * @returns {boolean} - True if the condition is satisfied, false otherwise
 */
const evaluateCondition = (fieldValue, operator, value) => {
  switch (operator) {
    case "==":
      return fieldValue === value;
    case "!=":
      return fieldValue !== value;
    case ">":
      return fieldValue > value;
    case "<":
      return fieldValue < value;
    case ">=":
      return fieldValue >= value;
    case "<=":
      return fieldValue <= value;
    /**
     * "includes":
     * - If fieldValue is an array, checks if value exists in fieldValue
     * - If value is an array, checks if fieldValue exists in value
     */
    case "includes":
      if (Array.isArray(fieldValue)) {
        return fieldValue.includes(value);
      }
      return Array.isArray(value) ? value.includes(fieldValue) : false;
    /**
     * "excludes":
     * - If fieldValue is an array, checks if value does NOT exist in fieldValue
     * - If value is an array, checks if fieldValue is NOT in value
     */
    case "excludes":
      if (Array.isArray(fieldValue)) {
        return !fieldValue.includes(value);
      }
      return Array.isArray(value) ? !value.includes(fieldValue) : false;
    default:
      return false;
  }
};

export default rffEvaluateFieldCondition;
