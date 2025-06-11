const formatPercent = (number) => {
  if (typeof number !== "number" || isNaN(number)) {
    return number;
  }

  const percent = (number * 100).toFixed(2);

  return `${percent}%`;
};

export default formatPercent;
