export function pick<T>(object: T, fields: (string | number)[]) {
  return fields.reduce(
    (result, field) => ({
      ...result,
      [field]: object[field],
    }),
    {},
  );
}
