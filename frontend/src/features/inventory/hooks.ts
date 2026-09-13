import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../../context/AuthContext'
import type { NewInventoryItem } from '../../types/inventory'
import {
  createInventoryItem,
  deleteInventoryItem,
  listAgingInventory,
  listDeadstockInventory,
  listInventory,
} from './api'

export const inventoryKeys = {
  all: ['inventory'] as const,
  aging: ['inventory', 'aging'] as const,
  deadstock: ['inventory', 'deadstock'] as const,
}

export function useInventory() {
  const { token } = useAuth()
  return useQuery({
    queryKey: inventoryKeys.all,
    queryFn: () => listInventory(token!),
    enabled: Boolean(token),
  })
}

export function useAgingInventory() {
  const { token } = useAuth()
  return useQuery({
    queryKey: inventoryKeys.aging,
    queryFn: () => listAgingInventory(token!),
    enabled: Boolean(token),
  })
}

export function useDeadstockInventory() {
  const { token } = useAuth()
  return useQuery({
    queryKey: inventoryKeys.deadstock,
    queryFn: () => listDeadstockInventory(token!),
    enabled: Boolean(token),
  })
}

function useInvalidateInventory() {
  const queryClient = useQueryClient()
  return () => {
    queryClient.invalidateQueries({ queryKey: inventoryKeys.all })
    queryClient.invalidateQueries({ queryKey: inventoryKeys.aging })
    queryClient.invalidateQueries({ queryKey: inventoryKeys.deadstock })
  }
}

export function useCreateInventoryItem() {
  const { token } = useAuth()
  const invalidate = useInvalidateInventory()
  return useMutation({
    mutationFn: (input: NewInventoryItem) => createInventoryItem(token!, input),
    onSuccess: invalidate,
  })
}

export function useDeleteInventoryItem() {
  const { token } = useAuth()
  const invalidate = useInvalidateInventory()
  return useMutation({
    mutationFn: (id: string) => deleteInventoryItem(token!, id),
    onSuccess: invalidate,
  })
}
