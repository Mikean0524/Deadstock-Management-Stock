import { Card } from '../components/ui/Card'
import { StatusBadge } from '../components/ui/StatusBadge'
import { useAgingInventory, useDeadstockInventory, useInventory } from '../features/inventory/hooks'

export function VendorDashboardPage() {
  const inventory = useInventory()
  const aging = useAgingInventory()
  const deadstock = useDeadstockInventory()

  // Wait for in-flight refetches too, not just the first load — otherwise a
  // revisit after adding/removing inventory briefly shows stale cached counts.
  if (inventory.isFetching || aging.isFetching || deadstock.isFetching) return <div className="grid min-h-64 place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-100 border-t-indigo-600" /></div>
  if (inventory.isError || aging.isError || deadstock.isError) {
    return <p className="text-rose-700">Could not load inventory data.</p>
  }

  const items = inventory.data ?? []
  const agingItems = aging.data ?? []
  const deadstockItems = deadstock.data ?? []

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl bg-slate-950 p-7 text-white shadow-xl shadow-slate-900/15 sm:p-10"><p className="text-sm font-semibold uppercase tracking-[.2em] text-cyan-300">Vendor workspace</p><h1 className="mt-3 text-3xl font-bold sm:text-4xl">Make every item count.</h1><p className="mt-3 max-w-xl text-slate-300">Monitor aging inventory and move surplus toward a verified second life.</p></section>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card title="Total items">
          <p className="text-4xl font-bold text-slate-900">{items.length}</p><p className="mt-1 text-sm text-slate-500">In your catalogue</p>
        </Card>
        <Card title="Aging">
          <p className="text-4xl font-bold text-amber-600">{agingItems.length}</p><p className="mt-1 text-sm text-slate-500">Worth reviewing</p>
        </Card>
        <Card title="Deadstock">
          <p className="text-4xl font-bold text-rose-600">{deadstockItems.length}</p><p className="mt-1 text-sm text-slate-500">Ready for action</p>
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
