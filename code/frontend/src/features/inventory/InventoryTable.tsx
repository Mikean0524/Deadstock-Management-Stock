import type { InventoryItem } from '../../types/inventory'
import { Button } from '../../components/ui/Button'
import { StatusBadge } from '../../components/ui/StatusBadge'

interface InventoryTableProps {
  items: InventoryItem[]
  onDelete: (id: string) => void
  isDeleting?: boolean
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString()
}

export function InventoryTable({ items, onDelete, isDeleting }: InventoryTableProps) {
  if (items.length === 0) {
    return <p className="rounded-md border border-dashed p-6 text-center text-slate-600">No inventory items yet.</p>
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="text-left text-xs uppercase tracking-wide text-slate-500">
          <th className="border-b px-3 py-2">Product</th>
          <th className="border-b px-3 py-2">Category</th>
          <th className="border-b px-3 py-2">Quantity</th>
          <th className="border-b px-3 py-2">Condition</th>
          <th className="border-b px-3 py-2">Purchased</th>
          <th className="border-b px-3 py-2">Status</th>
          <th className="border-b px-3 py-2"></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item.id} data-status={item.status}>
            <td className="border-b px-3 py-2">{item.product_name}</td>
            <td className="border-b px-3 py-2">{item.category}</td>
            <td className="border-b px-3 py-2">{item.quantity}</td>
            <td className="border-b px-3 py-2">{item.condition}</td>
            <td className="border-b px-3 py-2">{formatDate(item.purchase_date)}</td>
            <td className="border-b px-3 py-2">
              <StatusBadge status={item.status} />
              <p className="mt-1 text-xs text-slate-500">{item.lifecycle.reason}</p>
            </td>
            <td className="border-b px-3 py-2">
              <Button
                type="button"
                variant="danger"
                onClick={() => onDelete(item.id)}
                disabled={isDeleting || item.status === 'SUBMITTED_FOR_VERIFICATION'}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
