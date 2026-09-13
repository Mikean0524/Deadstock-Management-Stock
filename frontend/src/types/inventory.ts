export type InventoryCondition = 'NEW' | 'GOOD' | 'DAMAGED'

export type InventoryStatus = 'ACTIVE' | 'AGING' | 'DEADSTOCK_FLAGGED' | 'SUBMITTED_FOR_VERIFICATION'

export interface InventoryLifecycle {
  status: InventoryStatus
  daysSincePurchase: number
  daysUntilExpiry: number | null
  reason: string
}

export interface InventoryItem {
  id: string
  vendor_id: string
  product_name: string
  category: string
  quantity: number
  purchase_date: string
  expiry_date: string | null
  condition: InventoryCondition
  status: InventoryStatus
  created_at: string
  deadstock_flagged_at: string | null
  lifecycle: InventoryLifecycle
}

export interface NewInventoryItem {
  productName: string
  category: string
  quantity: number
  purchaseDate: string
  expiryDate?: string | null
  condition: InventoryCondition
}
