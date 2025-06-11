const formatDollar = (value, returnVal = "") => {
  if (value == null) {
    return returnVal;
  }

  const formattedNumber = new Intl.NumberFormat("en-US").format(value);
  return `$${formattedNumber}`;
};

export default formatDollar;
