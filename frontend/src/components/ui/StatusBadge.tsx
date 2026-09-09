import type { InventoryStatus } from '../../types/inventory'
import { getStatusLabel, getStatusTone } from '../../features/inventory/status'

const TONE_CLASSES = {
  neutral: 'bg-slate-100 text-slate-700',
  info: 'bg-indigo-100 text-indigo-700',
  warning: 'bg-amber-100 text-amber-800',
  danger: 'bg-rose-100 text-rose-700',
}

export function StatusBadge({ status }: { status: InventoryStatus }) {
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${TONE_CLASSES[getStatusTone(status)]}`}>
      {getStatusLabel(status)}
    </span>
  )
}
