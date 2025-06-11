export const valueFormatterNumber = (params, returnVal) => {
  const value = params?.value;
  if (value == null) {
    return returnVal;
  }

  const formattedNumber = new Intl.NumberFormat("en-US").format(value);
  return `${formattedNumber}`;
};
