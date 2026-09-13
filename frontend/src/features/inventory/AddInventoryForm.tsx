import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../components/ui/Button'
import { Select } from '../../components/ui/Select'
import { TextField } from '../../components/ui/TextField'
import type { InventoryCondition, NewInventoryItem } from '../../types/inventory'

interface AddInventoryFormProps {
  onSubmit: (item: NewInventoryItem) => void
  isSubmitting?: boolean
}

const EMPTY_FORM = {
  productName: '',
  category: '',
  quantity: '1',
  purchaseDate: new Date().toISOString().slice(0, 10),
  expiryDate: '',
  condition: 'NEW' as InventoryCondition,
}

export function AddInventoryForm({ onSubmit, isSubmitting }: AddInventoryFormProps) {
  const [form, setForm] = useState(EMPTY_FORM)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSubmit({
      productName: form.productName,
      category: form.category,
      quantity: Number(form.quantity),
      purchaseDate: form.purchaseDate,
      expiryDate: form.expiryDate || null,
      condition: form.condition,
    })
    setForm(EMPTY_FORM)
  }

  return (
    <form className="grid gap-4 rounded-3xl border border-white bg-white/85 p-6 shadow-xl shadow-slate-900/5 backdrop-blur-sm sm:grid-cols-2 lg:grid-cols-3" onSubmit={handleSubmit}>
      <div className="sm:col-span-2 lg:col-span-3"><p className="text-sm font-bold uppercase tracking-[.16em] text-indigo-600">New stock</p><h2 className="mt-1 text-xl font-bold">Add an item to your inventory</h2><p className="mt-1 text-sm text-slate-500">The system will automatically assess its lifecycle.</p></div>
      <TextField
        label="Product name"
        value={form.productName}
        onChange={(event) => setForm((prev) => ({ ...prev, productName: event.target.value }))}
        required
      />
      <TextField
        label="Category"
        value={form.category}
        onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
        required
      />
      <TextField
        label="Quantity"
        type="number"
        min={1}
        value={form.quantity}
        onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
        required
      />
      <TextField
        label="Purchase date"
        type="date"
        value={form.purchaseDate}
        onChange={(event) => setForm((prev) => ({ ...prev, purchaseDate: event.target.value }))}
        required
      />
      <TextField
        label="Expiry date (optional)"
        type="date"
        value={form.expiryDate}
        onChange={(event) => setForm((prev) => ({ ...prev, expiryDate: event.target.value }))}
      />
      <Select
        label="Condition"
        value={form.condition}
        onChange={(event) => setForm((prev) => ({ ...prev, condition: event.target.value as InventoryCondition }))}
      >
        <option value="NEW">New</option>
        <option value="GOOD">Good</option>
        <option value="DAMAGED">Damaged</option>
      </Select>
      <div className="flex items-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add item'}
        </Button>
      </div>
    </form>
  )
}
