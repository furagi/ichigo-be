export function pick(
  object: { [K: string]: unknown },
  fields: (string | number)[],
) {
  return fields.reduce(
    (result, field) => ({
      ...result,
      [field]: object[field],
    }),
    {},
  );
}
