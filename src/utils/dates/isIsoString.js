export const isIsoString = (value) => {
  if (value == null) {
    return false;
  }

  const isoFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[\+\-]\d{2}:\d{2})?$/;
  return isoFormat.test(value);
};
