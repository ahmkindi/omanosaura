/**
 * Cost parity with the legacy Go handler: every `pricePer` participants incur
 * the base price once; the optional extra is per participant.
 */
export function computeCostBaisa({
  quantity,
  basePriceBaisa,
  extraPriceBaisa,
  pricePer,
  payExtra,
}: {
  quantity: number
  basePriceBaisa: number
  extraPriceBaisa: number
  pricePer: number
  payExtra: boolean
}): number {
  const groups = Math.ceil(quantity / Math.max(pricePer, 1))
  return groups * basePriceBaisa + (payExtra ? quantity * extraPriceBaisa : 0)
}
