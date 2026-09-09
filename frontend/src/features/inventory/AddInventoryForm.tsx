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
    <form className="grid gap-4 rounded-xl border bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-3" onSubmit={handleSubmit}>
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
