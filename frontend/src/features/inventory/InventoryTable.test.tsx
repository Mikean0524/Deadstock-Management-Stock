import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { InventoryItem } from '../../types/inventory'
import { InventoryTable } from './InventoryTable'

function makeItem(overrides: Partial<InventoryItem>): InventoryItem {
  return {
    id: '1',
    vendor_id: 'vendor-1',
    product_name: 'Surplus office chairs',
    category: 'FURNITURE',
    quantity: 12,
    purchase_date: '2026-01-01T00:00:00.000Z',
    expiry_date: null,
    condition: 'GOOD',
    status: 'ACTIVE',
    created_at: '2026-01-01T00:00:00.000Z',
    deadstock_flagged_at: null,
    lifecycle: { status: 'ACTIVE', daysSincePurchase: 5, daysUntilExpiry: null, reason: 'Item is within the healthy inventory window.' },
    ...overrides,
  }
}

describe('InventoryTable', () => {
  it('renders a row per item with its status badge', () => {
    const items = [
      makeItem({ id: '1', product_name: 'Fresh Item', status: 'ACTIVE' }),
      makeItem({ id: '2', product_name: 'Aging Item', status: 'AGING' }),
      makeItem({ id: '3', product_name: 'Deadstock Item', status: 'DEADSTOCK_FLAGGED' }),
    ]

    render(<InventoryTable items={items} onDelete={() => {}} />)

    expect(screen.getByText('Fresh Item')).toBeInTheDocument()
    expect(screen.getByText('Active')).toBeInTheDocument()
    expect(screen.getByText('Aging Item')).toBeInTheDocument()
    expect(screen.getByText('Aging')).toBeInTheDocument()
    expect(screen.getByText('Deadstock Item')).toBeInTheDocument()
    expect(screen.getByText('Deadstock')).toBeInTheDocument()
  })

  it('shows an empty state when there are no items', () => {
    render(<InventoryTable items={[]} onDelete={() => {}} />)
    expect(screen.getByText('No inventory items yet.')).toBeInTheDocument()
  })

  it('disables delete for items already submitted for verification', () => {
    const items = [makeItem({ status: 'SUBMITTED_FOR_VERIFICATION' })]
    render(<InventoryTable items={items} onDelete={() => {}} />)
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled()
  })

  it('calls onDelete with the item id', async () => {
    const onDelete = vi.fn()
    const items = [makeItem({ id: 'abc' })]
    render(<InventoryTable items={items} onDelete={onDelete} />)
    screen.getByRole('button', { name: 'Delete' }).click()
    expect(onDelete).toHaveBeenCalledWith('abc')
  })
})
