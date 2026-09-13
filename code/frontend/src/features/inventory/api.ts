import { apiRequest } from '../../lib/api'
import type { InventoryItem, NewInventoryItem } from '../../types/inventory'

export function listInventory(token: string): Promise<InventoryItem[]> {
  return apiRequest('/api/inventory', { token })
}

export function listAgingInventory(token: string): Promise<InventoryItem[]> {
  return apiRequest('/api/inventory/aging', { token })
}

export function listDeadstockInventory(token: string): Promise<InventoryItem[]> {
  return apiRequest('/api/inventory/deadstock', { token })
}

export function createInventoryItem(token: string, input: NewInventoryItem): Promise<InventoryItem> {
  return apiRequest('/api/inventory', {
    method: 'POST',
    token,
    body: JSON.stringify(input),
  })
}

export function deleteInventoryItem(token: string, id: string): Promise<void> {
  return apiRequest(`/api/inventory/${id}`, { method: 'DELETE', token })
}
