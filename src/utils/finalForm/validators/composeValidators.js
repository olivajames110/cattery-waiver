// export const composeValidators =
//   (...validators) =>
//   (value) =>
//     validators.reduce(
//       (error, validator) => error || validator(value),
//       undefined
//     );
export const composeValidators =
  (...validators) =>
  (value, allValues, meta) => {
    for (const validator of validators) {
      const error = validator(value, allValues, meta);
      if (error) {
        return error; // short-circuit on the first error
      }
    }
    return undefined;
  };
