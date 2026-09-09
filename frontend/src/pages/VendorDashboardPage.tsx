import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useAgingInventory, useDeadstockInventory, useInventory } from '../features/inventory/hooks'

export function VendorDashboardPage() {
  const inventory = useInventory()
  const aging = useAgingInventory()
  const deadstock = useDeadstockInventory()

  // Wait for in-flight refetches too, not just the first load — otherwise a
  // revisit after adding/removing inventory briefly shows stale cached counts.
  if (inventory.isFetching || aging.isFetching || deadstock.isFetching) return <p>Loading dashboard...</p>
  if (inventory.isError || aging.isError || deadstock.isError) {
    return <p className="text-rose-700">Could not load inventory data.</p>
  }

  const items = inventory.data ?? []
  const agingItems = aging.data ?? []
  const deadstockItems = deadstock.data ?? []

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Vendor Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Total items">
          <p className="text-3xl font-semibold text-slate-900">{items.length}</p>
        </Card>
        <Card title="Aging">
          <p className="text-3xl font-semibold text-slate-900">{agingItems.length}</p>
        </Card>
        <Card title="Deadstock">
          <p className="text-3xl font-semibold text-slate-900">{deadstockItems.length}</p>
        </Card>
      </div>

      {deadstockItems.length > 0 && (
        <Card title="Needs attention">
          <ul className="space-y-2">
            {deadstockItems.map((item) => (
              <li key={item.id} className="flex items-center justify-between text-sm">
                <span>
                  {item.product_name} ({item.category})
                </span>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
