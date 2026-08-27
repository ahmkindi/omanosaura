export function formatOMR(baisa: number, locale: string): string {
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-OM' : 'en-OM', {
    style: 'currency',
    currency: 'OMR',
    minimumFractionDigits: 1,
    maximumFractionDigits: 3,
  }).format(baisa / 1000)
}
