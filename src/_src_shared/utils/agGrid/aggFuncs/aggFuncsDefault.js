export const aggFuncsDefault = (params) => {
  return {
    enhancedAverage: (params) => {
      const values = params.values;
      if (params.rowNode.leafGroup) {
        // For leaf groups, calculate detailed statistics
        const sum = values.reduce((acc, val) => acc + val, 0);
        const count = values.length;
        const avg = roundToDecimal(sum / count, 2);

        // Calculate standard deviation
        const squaredDiffs = values.map((value) => Math.pow(value - avg, 2));
        const avgSquaredDiff = calculateAverage(squaredDiffs);
        const stdDev = roundToDecimal(Math.sqrt(avgSquaredDiff), 2);

        return {
          sum: sum,
          count: count,
          stdDev: stdDev,
          value: avg, // Primary display value
        };
      }

      // For parent groups, aggregate the statistics from children
      let totalSum = 0;
      let totalCount = 0;
      let weightedSumOfSquares = 0;

      values.forEach((value) => {
        totalSum += value.sum;
        totalCount += value.count;
        // Calculate contribution to variance from this subgroup
        weightedSumOfSquares +=
          Math.pow(value.stdDev, 2) * (value.count - 1) +
          value.count * Math.pow(value.value - totalSum / totalCount, 2);
      });

      const groupAvg = roundToDecimal(totalSum / totalCount, 2);
      const groupStdDev = roundToDecimal(
        Math.sqrt(weightedSumOfSquares / (totalCount - 1)),
        2
      );

      return {
        sum: totalSum,
        count: totalCount,
        stdDev: groupStdDev,
        value: groupAvg, // Primary display value
      };
    },
    //enhacnedTotal
    //enhacnedMin
    //enhacnedMax

    // New comprehensive average function that mimics relationship between rangeCalc and simpleRange
    comprehensiveAverage: (params) => {
      const values = params.values;
      if (params.rowNode.leafGroup) {
        const sum = values.reduce((acc, val) => acc + val, 0);
        const count = values.length;
        const avg = roundToDecimal(sum / count, 2);

        // Calculate additional statistics
        const min = Math.min(...values);
        const max = Math.max(...values);
        const sortedValues = [...values].sort((a, b) => a - b);
        const median =
          count % 2 === 0
            ? (sortedValues[count / 2 - 1] + sortedValues[count / 2]) / 2
            : sortedValues[Math.floor(count / 2)];

        // Calculate standard deviation
        const squaredDiffs = values.map((value) => Math.pow(value - avg, 2));
        const avgSquaredDiff = calculateAverage(squaredDiffs);
        const stdDev = roundToDecimal(Math.sqrt(avgSquaredDiff), 2);

        return {
          avg: avg,
          median: roundToDecimal(median, 2),
          min: min,
          max: max,
          range: max - min,
          count: count,
          sum: sum,
          stdDev: stdDev,
          value: avg, // Primary display value
        };
      }

      // For parent groups, aggregate statistics from children with proper weighting
      let totalSum = 0;
      let totalCount = 0;
      let minValue = values[0].min;
      let maxValue = values[0].max;
      let weightedSum = 0;

      // Calculate weighted stats for proper aggregation
      values.forEach((value) => {
        totalSum += value.sum;
        totalCount += value.count;
        minValue = Math.min(minValue, value.min);
        maxValue = Math.max(maxValue, value.max);
        weightedSum += value.avg * value.count;
      });

      const groupAvg = roundToDecimal(weightedSum / totalCount, 2);

      // Calculate weighted standard deviation (approximation)
      const weightedVariance = values.reduce((acc, value) => {
        // Within-group variance contribution
        const withinGroupVariance =
          Math.pow(value.stdDev, 2) * (value.count / totalCount);
        // Between-group variance contribution
        const betweenGroupVariance =
          Math.pow(value.avg - groupAvg, 2) * (value.count / totalCount);
        return acc + withinGroupVariance + betweenGroupVariance;
      }, 0);

      const groupStdDev = roundToDecimal(Math.sqrt(weightedVariance), 2);

      return {
        avg: groupAvg,
        median: null, // Can't aggregate median directly from subgroups
        min: minValue,
        max: maxValue,
        range: maxValue - minValue,
        count: totalCount,
        sum: totalSum,
        stdDev: groupStdDev,
        value: groupAvg, // Primary display value
      };
    },
  };
};

function roundToDecimal(number, decimals) {
  const factor = 10 ** decimals;
  return Math.round(number * factor) / factor;
}

function calculateAverage(numbers) {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return 0;
  }

  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return roundToDecimal(sum / numbers.length, 2);
}
