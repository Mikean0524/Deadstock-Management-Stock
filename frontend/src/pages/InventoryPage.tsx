import { AddInventoryForm } from '../features/inventory/AddInventoryForm'
import { InventoryTable } from '../features/inventory/InventoryTable'
import { useCreateInventoryItem, useDeleteInventoryItem, useInventory } from '../features/inventory/hooks'

export function InventoryPage() {
  const inventory = useInventory()
  const createItem = useCreateInventoryItem()
  const deleteItem = useDeleteInventoryItem()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Inventory</h1>
      <AddInventoryForm onSubmit={(item) => createItem.mutate(item)} isSubmitting={createItem.isPending} />
      {inventory.isLoading && <p>Loading inventory...</p>}
      {inventory.isError && <p className="text-rose-700">Could not load inventory data.</p>}
      {inventory.data && (
        <InventoryTable
          items={inventory.data}
          onDelete={(id) => deleteItem.mutate(id)}
          isDeleting={deleteItem.isPending}
        />
      )}
    </div>
  )
}
