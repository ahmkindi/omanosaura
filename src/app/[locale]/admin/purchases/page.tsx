import { getAllPurchases } from '@/data/purchases'
import { PurchasesTable } from '@/components/admin/purchases-table'

export default async function AdminPurchasesPage() {
  const purchases = await getAllPurchases()
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold" dir="ltr">
        Purchases
      </h1>
      <PurchasesTable purchases={purchases} />
    </div>
  )
}
