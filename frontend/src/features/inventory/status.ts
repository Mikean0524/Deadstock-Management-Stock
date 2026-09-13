import type { InventoryStatus } from '../../types/inventory'

export type StatusTone = 'neutral' | 'info' | 'warning' | 'danger'

export const STATUS_LABEL: Record<InventoryStatus, string> = {
  ACTIVE: 'Active',
  AGING: 'Aging',
  DEADSTOCK_FLAGGED: 'Deadstock',
  SUBMITTED_FOR_VERIFICATION: 'Submitted',
}

export const STATUS_TONE: Record<InventoryStatus, StatusTone> = {
  ACTIVE: 'neutral',
  AGING: 'warning',
  DEADSTOCK_FLAGGED: 'danger',
  SUBMITTED_FOR_VERIFICATION: 'info',
}

export function getStatusLabel(status: InventoryStatus): string {
  return STATUS_LABEL[status]
}

export function getStatusTone(status: InventoryStatus): StatusTone {
  return STATUS_TONE[status]
}
