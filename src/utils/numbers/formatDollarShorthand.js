import { isNil } from "lodash";

export const formatDollarShorthand = (num) => {
  if (!num || !isFinite(num) || isNil(num)) return "$0";

  const absNum = Math.abs(num);
  let formatted;

  if (absNum >= 1e9) {
    formatted = `$${(num / 1e9).toFixed(1)}B`;
  } else if (absNum >= 1e6) {
    formatted = `$${(num / 1e6).toFixed(1)}M`;
  } else if (absNum >= 1e3) {
    formatted = `$${(num / 1e3).toFixed(1)}K`;
  } else {
    formatted = `$${num.toFixed(1)}`;
  }

  return formatted.replace(/\.0(?=[KMB])/g, ""); // Remove trailing ".0" if not needed
};
