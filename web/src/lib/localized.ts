type LocalizedSuffix<T> = {
  [K in keyof T]: K extends string
    ? `${K}Ar` extends keyof T
      ? K
      : never
    : never
}[keyof T]

/**
 * Picks the Arabic variant of a field (e.g. titleAr) when locale is 'ar' and
 * the Arabic value is non-empty, otherwise the base field.
 */
export function pickLocalized<T extends Record<string, unknown>>(
  row: T,
  field: LocalizedSuffix<T>,
  locale: string,
): string {
  const base = row[field] as string
  if (locale !== 'ar') return base
  const ar = row[`${String(field)}Ar` as keyof T] as string | undefined
  return ar && ar !== '' ? ar : base
}
